import rentalService from "../service/rental.service";
import productService from "../service/product.service";
import moment from "moment/moment";
class rentalController{
    constructor() {
        this.vnpayPayment = this.vnpayPayment.bind(this);
        this.paymentReturn = this.paymentReturn.bind(this);
    }
    async  create(req, res) {
        try {
                if(!!req.body){
                    const startDate=new Date()
                    const endDate= new Date()
                    endDate.setMonth(startDate.getMonth() + req.body.quantityMonth);
                    const data={
                        ...req.body,
                        startDate:startDate,
                        endDate:endDate

                    }
                     const result=await rentalService.create(data)
                     if(!!result){
                         const products = req.body.products
                         console.log(products);
                         products.forEach(async (product) =>{
                            await productService.updateAfterRental(product.productId,{quantity:Number(product.quantity)})
                         })
                         res.json({mes:'Thêm đơn hàng thuê thành công',status:true, data: result});
                     }
                     else{
                        res.json({mes:'Thêm đơn hàng thuê không thành công',status:false})
                     }
                }
                else{
                    res.json({mes:'Truyền dữ liệu không đúng',status:false})
                }
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getAll(req, res){
        try {
            const {pageNumber=undefined} = req.query
            const {pageSize=undefined} = req.query
            const result = await rentalService.find({},pageNumber,pageSize)
            res.json(result)
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async getById(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id){
                const result = await rentalService.findById(id)
                res.json(result)
            }
            else{
                res.json({mes:'Truyền id query'})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }

    async update(req, res){
        try {
            const {id=undefined} = req.query
            if(!!id && !!req.body){
                    const data={
                        ...req.body
                    }
                    const result = await rentalService.update(id, data)
                    res.json({mes:'Cập nhật thành công', status:true, data:result})
            }
            else{
                res.status(400).json({mes:'Chưa truyền dữ liệu'})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }
    async filterByFullDate(req, res){
        try {
            const {month=undefined}= req.query
            const {day=undefined}= req.query
            const {year=undefined}= req.query
            const {field}= req.query
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const result = await rentalService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }

    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
    async vnpayPayment(req, res){
        const url = req.query.url
        req.session.url=url
        const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
    
        let tmnCode = 'M0UIOUJQ';
        let secretKey ='QAHUEZEOIRUDZATPCTITIGLAKLKOHGHL';
        let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        let returnUrl = 'http://localhost:3000/rental/payment'
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        let orderId = req.body.orderId;
        let amount = req.body.totalAmount || 0; // thêm tiền ở đây
        let orderInfo = req.body.orderDescription || 'Thanh toán hóa đơn mua hàng';
        let orderType = req.body.orderType || 'billpayment';
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        
        vnp_Params = this.sortObject(vnp_Params);
    
        let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");     
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
            res.send(vnpUrl)
    }

    async paymentReturn(req, res){
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = this.sortObject(vnp_Params)
        let secretKey ='QAHUEZEOIRUDZATPCTITIGLAKLKOHGHL';

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     
        if(vnp_Params['vnp_ResponseCode'] == '00') {
            const a = await rentalService.update(vnp_Params['vnp_TxnRef'],{isPayment:true,paymentMethod:'Online'})
            if(secureHash === signed){
                return res.redirect(`http://localhost:3001/${req.session.url ? req.session.url :''}/?success=true&id=${vnp_Params['vnp_TxnRef']}`)
                
            } else{
                return res.redirect(`http://localhost:3001/${req.session.url ? req.session.url :''}/?success=false&id=${vnp_Params['vnp_TxnRef']}`)
            }
        }
        else{
            return res.redirect(`http://localhost:3001/${req.session.url ? req.session.url :''}/?success=false&id=${vnp_Params['vnp_TxnRef']}`)
        }
        
    }

    
    
}

export default new rentalController()