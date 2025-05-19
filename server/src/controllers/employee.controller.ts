import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { logger } from '../utils/logger.util';
import { IUser } from '../interfaces/models/user.interface';

// interface Request extends Request {
//   user?: IUser;
// }

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner only'
        });
        return;
      }

      const employee = await this.employeeService.createEmployee({
        ...req.body,
        storeId: req.user.storeId
      });
      res.status(201).json({
        success: true,
        data: employee
      });
    } catch (error) {
      logger.error('Create employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating employee'
      });
    }
  };

  getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const employee = await this.employeeService.getEmployeeById(req.params.id);
      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      logger.error('Get employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting employee'
      });
    }
  };

  updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner only'
        });
        return;
      }

      const employee = await this.employeeService.updateEmployee(req.params.id, req.body);
      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      logger.error('Update employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating employee'
      });
    }
  };

  deleteEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner only'
        });
        return;
      }

      await this.employeeService.deleteEmployee(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      logger.error('Delete employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting employee'
      });
    }
  };

  getEmployeesByStore = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner only'
        });
        return;
      }

      const { page, limit, sort } = req.query;
      const result = await this.employeeService.getEmployeesByStore(req.user.storeId, {
        page: Number(page),
        limit: Number(limit),
        sort: sort as string
      });
      res.status(200).json({
        success: true,
        data: result.employees,
        total: result.total
      });
    } catch (error) {
      logger.error('Get employees by store error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting employees'
      });
    }
  };

  updateLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const { lat, lng } = req.body;
      await this.employeeService.updateLocation(req.user._id, lat, lng);
      res.status(200).json({
        success: true,
        message: 'Location updated successfully'
      });
    } catch (error) {
      logger.error('Update location error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating location'
      });
    }
  };

  updateAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const { isAvailable } = req.body;
      await this.employeeService.updateAvailability(req.user._id, isAvailable);
      res.status(200).json({
        success: true,
        message: 'Availability updated successfully'
      });
    } catch (error) {
      logger.error('Update availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating availability'
      });
    }
  };

  getEmployeeStats = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const stats = await this.employeeService.getEmployeeStats(req.user._id);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Get employee stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting employee stats'
      });
    }
  };

  getEmployeeSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const employeeId = req.params.id;
      
      const employee = await this.employeeService.getEmployeeById(employeeId);
      if (!employee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: employee.schedule || {}
      });
    } catch (error) {
      logger.error('Get employee schedule error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting employee schedule'
      });
    }
  };

  updateEmployeeSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner only'
        });
        return;
      }

      const employeeId = req.params.id;
      const { schedule } = req.body;
      
      const updatedEmployee = await this.employeeService.updateEmployeeSchedule(employeeId, schedule);
      if (!updatedEmployee) {
        res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: updatedEmployee,
        message: 'Employee schedule updated successfully'
      });
    } catch (error) {
      logger.error('Update employee schedule error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating employee schedule'
      });
    }
  };
} 