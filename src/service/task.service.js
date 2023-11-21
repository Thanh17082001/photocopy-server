import taskModel from '../model/task.model'
class taskService{
    async create(data){
        return await taskModel.create(data)
    }

    async find(condition={}, pageNumber={}, pageSize={}, sort={createdAt:-1}){
        const skip = !!pageNumber && !!pageSize ? (pageNumber - 1) * pageSize : {};
        return await taskModel
            .find(condition)
            .sort(sort)
            .populate('serviceId')
            .populate('staffId')
            .skip(skip)
            .limit(pageSize)
            .lean();
    }

    async update(id, data){
        return await taskModel.findByIdAndUpdate(id, data, {returnDocument:'after', upsert:true})
    }

    async findById(id){
        return await taskModel
        .findById(id)
        .populate('staffId')
        .populate('serviceId')
        .lean()
    }

    // loc theo ngay thang nam
    async findByDate(day, month, year, field, pageNumber, pageSize) {
        // co phan trang
        const condition = {
            $expr: {
                $and: [],
            },
        };
        if (day != 0) {
            condition.$expr.$and.push({ $eq: [{ $dayOfMonth: '$' + field }, day] });
        }
        if (month != 0) {
            condition.$expr.$and.push({ $eq: [{ $month: '$' + field }, month] });
        }
        if (year != 0 && month != 0) {
            condition.$expr.$and.push({ $eq: [{ $year: '$' + field }, year] });
        }
        if (!!pageNumber && !!pageSize) {
            const skip = (pageNumber - 1) * pageSize;
            const result = await taskModel.find(condition).sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate('serviceId')
            .populate('staffId').lean()
            return result;
        }
        // khong phan trang && khong dung de find private key
        else {
            return await taskModel.find(condition).sort({ createdAt: -1 });
        }
    }
    async delete(id){
        return taskModel.findByIdAndDelete(id)
    }

    async revenueYear(startDate, endDate){
        const result = await taskModel.aggregate([
            {
              $match: {
                startDate: { $gte: startDate, $lte: endDate },
                status:'Đã báo cáo'
              }
            },
            {
              $group: {
                _id: { $month: '$startDate' },
                totalRevenue: { $sum: '$totalAmount' }
              }
            },
            {
              $project: {
                _id: 0,
                month: '$_id',
                totalRevenue: 1
              }
            },
            {
              $sort: { month: 1 }
            }
          ]);
        return result
    }
    async revenueMonth(firstDayOfMonth, lastDayOfMonth){
        const result = await taskModel.aggregate([
            {
                $match: {
                  startDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
                  status:'Đã báo cáo'

                }
              },
              {
                $group: {
                  _id: { $dayOfMonth: '$startDate' },
                  totalRevenue: { $sum: '$totalAmount' }
                }
              },
              {
                $project: {
                  day: '$_id',
                  totalRevenue: 1,
                  _id: 0
                }
              },
              {
                $sort: { day: 1 }
              }
          ]);
        return result
    }

    async expenseYear(startDate, endDate){
      const result = await taskModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status:'Đã báo cáo'
          }
        },
        {
          $unwind: "$products"
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            totalRevenue: {
              $sum: { $multiply: ["$products.priceImport", "$products.quantity"] }
            }
          }
        },
        {
          $project: {
              month: '$_id', // Tạo trường label từ _id
              totalRevenue: 1,
              _id: 0 // Loại bỏ trường _id
          }
      },
        {
          $sort: { month: 1 }
        }
        ]);
      return result
  }
  async expenseMonth(firstDayOfMonth, lastDayOfMonth){
      const result = await taskModel.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
            status:'Đã báo cáo'
          }
        },
        {
          $unwind: "$products"
        },
        {
          $group: {
            _id: { $dayOfMonth: '$createdAt' },
            totalRevenue: {
              $sum: { $multiply: ["$products.priceImport", "$products.quantity"] }
            }
          }
        },
        {
          $project: {
              day: '$_id', // Tạo trường label từ _id
              totalRevenue: 1,
              _id: 0 // Loại bỏ trường _id
          }
      },
      {
        $sort: { day: 1 }
      }
        ]);
      return result
  }
    
}

export default new taskService()