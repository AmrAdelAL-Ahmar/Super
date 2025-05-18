import { logger } from '../utils/logger.util';
import EmployeeModel from '../models/employee.model';
import { IDeliveryEmployee, UserRole } from '../interfaces/models/user.interface';
import { generateVerificationToken } from '../utils/token.util';
import { sendVerificationEmail } from '../utils/email.util';
import { hashPassword } from 'src/utils/password.util';

export class EmployeeService {
  async createEmployee(employeeData: Partial<IDeliveryEmployee>): Promise<IDeliveryEmployee> {
    try {
      // Generate temporary password
      const tempPassword = generateVerificationToken().slice(0, 8);
      const hashedPassword = await hashPassword(tempPassword);

      const employee = await EmployeeModel.create({
        ...employeeData,
        password: hashedPassword,
        role: UserRole.EMPLOYEE
      });

      // Send email with temporary password
      await sendVerificationEmail(employee.email, tempPassword);

      return employee.toObject() as IDeliveryEmployee;
    } catch (error) {
      logger.error('Create employee error:', error);
      throw error;
    }
  }

  async getEmployeeById(id: string): Promise<IDeliveryEmployee | null> {
    try {
      return await EmployeeModel.findById(id)   
        .populate('storeId', 'name address')
        .select('-password')
        .lean()
        .then(employee => employee ? employee.toObject() as IDeliveryEmployee : null);
    } catch (error) {
      logger.error('Get employee error:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, updateData: Partial<IDeliveryEmployee>): Promise<IDeliveryEmployee | null> {
    try {
      return await EmployeeModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password')
        .lean()
        .then(employee => employee ? employee.toObject() as IDeliveryEmployee : null);
    } catch (error) {
      logger.error('Update employee error:', error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await EmployeeModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete employee error:', error);
      throw error;
    }
  }

  async getEmployeesByStore(storeId: string, options: any = {}): Promise<{ employees: IDeliveryEmployee[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [employees, total] = await Promise.all([
        EmployeeModel.find({ storeId })
          .select('-password')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        EmployeeModel.countDocuments({ storeId })
      ]);

      return { employees: employees.map(employee => employee.toObject() as IDeliveryEmployee), total };
    } catch (error) {
      logger.error('Get employees by store error:', error);
      throw error;
    }
  }

  async updateEmployeeStatus(id: string, isActive: boolean): Promise<IDeliveryEmployee | null> {
    try {
      return await EmployeeModel.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true }
      ).select('-password')
        .lean()
        .then(employee => employee ? employee.toObject() as IDeliveryEmployee : null);
    } catch (error) {
      logger.error('Update employee status error:', error);
      throw error;
    }
  }

  async resetEmployeePassword(id: string): Promise<void> {
    try {
      const employee = await EmployeeModel.findById(id);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Generate new temporary password
      const tempPassword = generateVerificationToken().slice(0, 8);
      const hashedPassword = await hashPassword(tempPassword);

      employee.password = hashedPassword;
      await employee.save();

      // Send email with new temporary password
      await sendVerificationEmail(employee.email, tempPassword);
    } catch (error) {
      logger.error('Reset employee password error:', error);
      throw error;
    }
  }

  async getEmployeeStats(storeId: string): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
  }> {
    try {
      const [total, active] = await Promise.all([
        EmployeeModel.countDocuments({ storeId }),
        EmployeeModel.countDocuments({ storeId, isActive: true })
      ]);

      return {
        totalEmployees: total,
        activeEmployees: active,
        inactiveEmployees: total - active
      };
    } catch (error) {
      logger.error('Get employee stats error:', error);
      throw error;
    }
  }

  async updateLocation(employeeId: string, lat: number, lng: number): Promise<void> {
    try {
      await EmployeeModel.findByIdAndUpdate(employeeId, {
        $set: { currentLocation: { lat, lng } }
      });
    } catch (error) {
      logger.error('Update location error:', error);
      throw error;
    }
  }

  async updateAvailability(employeeId: string, isAvailable: boolean): Promise<void> {
    try {
      await EmployeeModel.findByIdAndUpdate(employeeId, {
        $set: { isAvailable }
      });
    } catch (error) {
      logger.error('Update availability error:', error);
      throw error;
    }
  }

  async updateEmployeeSchedule(employeeId: string, schedule: any): Promise<IDeliveryEmployee | null> {
    try {
      return await EmployeeModel.findByIdAndUpdate(
        employeeId,
        { $set: { schedule } },
        { new: true }
      ).select('-password')
        .lean()
        .then(employee => employee ? employee as unknown as IDeliveryEmployee : null);
    } catch (error) {
      logger.error('Update employee schedule error:', error);
      throw error;
    }
  }

  /**
   * Find available delivery employees for a specific store and time
   * Uses both real-time availability and scheduled availability
   */
  async findAvailableDeliveryEmployees(
    storeId: string, 
    options: { 
      maxDistance?: number;
      limit?: number;
      currentTime?: Date;
    } = {}
  ): Promise<IDeliveryEmployee[]> {
    try {
      const { 
        maxDistance = 10, // Default 10km radius
        limit = 10,       // Default 10 employees
        currentTime = new Date()
      } = options;

      // Get current day of week
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDay = days[currentTime.getDay()];
      
      // Format current time as HH:MM for comparison
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      // Find employees that:
      // 1. Belong to the specified store
      // 2. Are active
      // 3. Are marked as available
      // 4. Are scheduled to work today at the current time
      const schedulePath = `schedule.${currentDay}`;
      const employees = await EmployeeModel.find({
        storeId,
        isActive: true,
        isAvailable: true,
        // Check if employee is scheduled to work today
        [`${schedulePath}.isWorking`]: true,
        // Check if current time is within working hours
        [`${schedulePath}.startTime`]: { $lte: formattedTime },
        [`${schedulePath}.endTime`]: { $gte: formattedTime }
      })
      .sort({ deliveredOrders: 1 }) // Sort by least busy delivery employee
      .limit(limit)
      .select('-password')
      .lean();

      return employees as unknown as IDeliveryEmployee[];
    } catch (error) {
      logger.error('Find available delivery employees error:', error);
      throw error;
    }
  }

  /**
   * Get the best delivery employee for an order based on location and availability
   */
  async getBestDeliveryEmployee(
    storeId: string,
    deliveryAddress: { lat: number; lng: number }
  ): Promise<IDeliveryEmployee | null> {
    try {
      // Find available employees
      const availableEmployees = await this.findAvailableDeliveryEmployees(storeId);
      
      if (availableEmployees.length === 0) {
        return null;
      }
      
      // Filter employees who have location data
      const employeesWithLocation = availableEmployees.filter(
        employee => employee.currentLocation?.lat && employee.currentLocation?.lng
      );

      if (employeesWithLocation.length === 0) {
        // If no employees have location, just return first available
        return availableEmployees[0];
      }
      
      // Calculate distance for each employee from delivery address
      const employeesWithDistance = employeesWithLocation.map(employee => {
        const distance = this.calculateDistance(
          employee.currentLocation!,
          deliveryAddress
        );
        
        return {
          employee,
          distance,
          // Simple score based on distance and rating
          score: (5 - (distance / 10)) + employee.rating
        };
      });
      
      // Sort by score (descending) and return the best match
      employeesWithDistance.sort((a, b) => b.score - a.score);
      
      return employeesWithDistance[0].employee;
    } catch (error) {
      logger.error('Get best delivery employee error:', error);
      throw error;
    }
  }
  
  /**
   * Calculate distance between two points using Haversine formula
   * This is a helper utility for this service
   */
  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const lat1 = this.toRad(point1.lat);
    const lat2 = this.toRad(point2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }
  
  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
} 