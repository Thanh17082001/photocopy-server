import orderService from "../service/order.service";
import deepEqual from "deep-equal";
import moment from "moment/moment";
import productService from "../service/product.service";
import accessoryService from "../service/accessory.service";
class orderController{
    constructor() {
        this.vnpayPayment = this.vnpayPayment.bind(this);
        this.paymentReturn = this.paymentReturn.bind(this);
    }
    async  create(req, res) {
        try {
            
                if(!!req.body){
                    const data={
                        ...req.body,
                    }
                     const result=await orderService.create(data)
                     if(!!result){
                         const products = req.body.products
                         products.forEach(async (product) =>{
                            if(product.typeProduct =='product'){
                                await productService.updateAfterOrder(product.productId,{quantity:Number(product.quantity)})
                            }
                            else{
                                await accessoryService.updateAfterOrder(product.productId,{quantity:product.quantity})

                            }
                         })
                         res.json({mes:'Thêm đon hàng thành công',status:true, data: result});
                     }
                     else{
                        res.json({mes:'Thêm đon hàng không thành công',status:false})
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
            const result = await orderService.find({},pageNumber,pageSize)
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
                const result = await orderService.findById(id)
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
                    if(data.status=='Hủy đơn' ){
                        const rental= await orderService.findById(id)
                        if( rental.status=='Đang vận chuyển' || rental.status=='Đã giao hàng' || rental.status=='Đang sử dụng'){
                            res.json({mes:'Không thể hủy đơn',status:false})
                        }
                        else{
                            const result = await orderService.update(id, {status:data.status})
                            return res.json({mes:'Cập nhật thành công', status:true, data:result})
                        }
    
                    }
                    const result = await orderService.update(id, data)
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
        let returnUrl = 'http://localhost:3000/order/payment'
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
        // if(bankCode !== null && bankCode !== ''){
        //     vnp_Params['vnp_BankCode'] = 'VNBANK';
        // }
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
            await orderService.update(vnp_Params['vnp_TxnRef'],{isPayment:true,paymentMethod:'Online'})
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

    async filterByFullDate(req, res){
        try {
            const {month=undefined}= req.query
            const {day=undefined}= req.query
            const {year=undefined}= req.query
            const {field}= req.query
            const pageNumber = req.query.pageNumber ? req.query.pageNumber : {}
            const pageSize = req.query.pageSize ? req.query.pageSize : {}
            const result = await orderService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
        }
    }
    

    async paymetnWithMoMO(req, res){
        //parameters
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const requestId = partnerCode + new Date().getTime();
        const orderId = requestId;
        const orderInfo = "pay with MoMo";
        const redirectUrl = "http://localhost:3000/order/pay-momo-return";
        const ipnUrl = "http://localhost:3000/order/pay-momo-return";
        const amount = "50000";
        const requestType = "captureWallet"
        const extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        const rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
        //signature
        const crypto = require('crypto');
        const signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature,
            lang: 'en'
        });
        //Create the HTTPS objects
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        //Send the request and get the response
        const req2 = https.request(options, res => {
            
            res.setEncoding('utf8');
            res.on('data', (body) => {
                // gửi về client
                console.log('payUrl: ');
                console.log(JSON.parse(body).payUrl);
            });
        })

        req2.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        // write data to request body
        console.log("Sending....")
        req2.write(requestBody);
        req2.end();
    }

    returnMomo (req, res){
        // lưu vào đb
        console.log(req.query);
    }

    
}

export default new orderController()