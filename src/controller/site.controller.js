import orderService from '../service/order.service'
import rentalService from '../service/rental.service'
import taskService from '../service/task.service'
import warrantyService from '../service/warranty.service'
const covertArrayYear=(arrayItem)=>{
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    // Kết hợp kết quả aggregation với mảng chứa thông tin của 12 tháng
    const mergedResult = allMonths.map(month => {
        const foundMonth = arrayItem.find(item => item.month === month);
        return foundMonth || { month, totalRevenue: 0 };
    });
    return mergedResult
}

const covertArrayMonth=(arrayItem, allDaysInMonth)=>{
    // Kết hợp kết quả aggregation với mảng chứa thông tin của tất cả các ngày
    const mergedResult = allDaysInMonth.map(day => {
      const foundDay = arrayItem.find(item => item.day === day);
      return foundDay || { day, totalRevenue: 0 };
    });
    return mergedResult;
}

// tính tông các doanh thu
const calculateTotalRevenueYear = (arr1, arr2) => {
    return arr1.map((item, index) => ({
      month: item.month,
      totalRevenue: item.totalRevenue + arr2[index].totalRevenue
    }));
};
const calculateTotalRevenueMonth = (arr1, arr2) => {
    return arr1.map((item, index) => ({
      day: item.day,
      totalRevenue: item.totalRevenue + arr2[index].totalRevenue
    }));
};

class siteController{
    // tổng doanh thu
    async revenueYear(req, res){
        try {
            const year = req.query?.year || new Date().getFullYear()
            const startDate = new Date(`${year}-01-01T00:00:00Z`);
            const endDate = new Date(`${year}-12-31T23:59:59Z`);
            // test chỉ trả về tháng có dữ liệu
            let order = await orderService.revenueYear(startDate,endDate)
            let rental = await rentalService.revenueYear(startDate,endDate)
            let warranty = await warrantyService.revenueYear(startDate,endDate)
            let task = await taskService.revenueYear(startDate,endDate)
            const resultOrder=covertArrayYear(order)
            const resultRental=covertArrayYear(rental)
            const resultWarranty=covertArrayYear(warranty)
            const resulTtask=covertArrayYear(task)
            const a = calculateTotalRevenueYear(resultOrder, resultRental)
            const b = calculateTotalRevenueYear(resulTtask, resultWarranty)
            const result = calculateTotalRevenueYear(a, b)
            res.json({result, resultOrder, resultRental, resultWarranty, resulTtask})
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async revenueMonth(req, res){
        try {
            const year = req.query?.year || new Date().getFullYear()
            const month = req.query?.month || new Date().getMonth()+1
            const firstDayOfMonth = new Date(year, month - 1, 1);
            const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59);
            // test chỉ trả về ngày có dữ liệu
            let order = await orderService.revenueMonth(firstDayOfMonth,lastDayOfMonth)
            let rental = await rentalService.revenueMonth(firstDayOfMonth,lastDayOfMonth)
            let warranty = await warrantyService.revenueMonth(firstDayOfMonth,lastDayOfMonth)
            let task = await taskService.revenueMonth(firstDayOfMonth,lastDayOfMonth)
            const allDaysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
            const resultOrder = covertArrayMonth(order,allDaysInMonth)
            const resultRental = covertArrayMonth(rental,allDaysInMonth)
            const resultWarranty = covertArrayMonth(warranty,allDaysInMonth)
            const resultTask = covertArrayMonth(task,allDaysInMonth)
            const a =calculateTotalRevenueMonth(resultOrder, resultRental)
            const b =calculateTotalRevenueMonth(resultWarranty, resultTask)
            const result =calculateTotalRevenueMonth(a, b)
            res.json({result, resultOrder, resultRental, resultWarranty, resultTask})
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async expenseYear(req, res){
        try {
            const year = req.query?.year || new Date().getFullYear()
            const startDate = new Date(`${year}-01-01T00:00:00Z`);
            const endDate = new Date(`${year}-12-31T23:59:59Z`);
            let order = await orderService.expenseYear(startDate,endDate)
            let rental = await rentalService.expenseYear(startDate,endDate)
            let warranty = await warrantyService.expenseYear(startDate,endDate)
            let task = await taskService.expenseYear(startDate,endDate)
            const resultOrder=covertArrayYear(order)
            const resultRental=covertArrayYear(rental)
            const resultWarranty=covertArrayYear(warranty)
            const resulttask=covertArrayYear(task)
            const a = calculateTotalRevenueYear(resultOrder, resultRental)
            const b = calculateTotalRevenueYear(resulttask, resultWarranty)
            const result = calculateTotalRevenueYear(a, b)
            res.json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    }

    async expenseMonth(req, res){
        try {
            const year = req.query?.year || new Date().getFullYear()
            const month = req.query?.month || new Date().getMonth()+1
            const firstDayOfMonth = new Date(year, month - 1, 1);
            const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59);
            let order = await orderService.expenseMonth(firstDayOfMonth,lastDayOfMonth)
            let rental = await rentalService.expenseMonth(firstDayOfMonth,lastDayOfMonth)
            let warranty = await warrantyService.expenseMonth(firstDayOfMonth,lastDayOfMonth)
            let task = await taskService.expenseMonth(firstDayOfMonth,lastDayOfMonth)
            const allDaysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
            const resultOrder = covertArrayMonth(order,allDaysInMonth)
            const resultRental = covertArrayMonth(rental,allDaysInMonth)
            const resultWarranty = covertArrayMonth(warranty,allDaysInMonth)
            const resultTask = covertArrayMonth(task,allDaysInMonth)
            const a =calculateTotalRevenueMonth(resultOrder, resultRental)
            const b =calculateTotalRevenueMonth(resultWarranty, resultTask)
            const result =calculateTotalRevenueMonth(a, b)
            res.json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    }
    

}

export default new siteController()