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
                    let datePay= new Date()
                    endDate.setMonth(startDate.getMonth() + req.body.quantityMonth);
                    if(req.body.payInFull || req.body.quantityMonth==1){
                        datePay=endDate
                    }
                    
                    else{
                        datePay.setMonth(startDate.getMonth() + 1);
                    }  
                    const data={
                        ...req.body,
                        startDate:startDate,
                        endDate:endDate,
                        datePay

                    }
                     const result=await rentalService.create(data)
                     if(!!result){
                         const products = req.body.products
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
                if(data.status == 'Dừng thuê'){
                    data.products.forEach(async (product) =>{
                        await productService.updateAfterStopRental(product.productId,{quantity:Number(product.quantity)})
                     })
                    
                }
                if(data.status=='Hủy đơn' ){
                    const rental= await rentalService.findById(id)
                    if(rental.status =='Dừng thuê' || rental.status=='Đang vận chuyển' || rental.status=='Đã giao hàng' || rental.status=='Đang sử dụng'){
                        return res.json({mes:'Không thể hủy đơn',status:false})
                    }
                    else{
                        const result = await rentalService.update(id, {status:data.status})
                        return res.json({mes:'Cập nhật thành công', status:true, data:result})
                    }

                }
                const result = await rentalService.update(id, {status:data.status})
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
        let returnUrl = `http://localhost:3000/rental/payment/?url=${url}&id=${req.body.orderId}`
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        let orderId = req.body.orderId +new Date().getTime();
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
            const rental=await rentalService.findById(req.query.id)
            console.log(vnp_Params['vnp_Amount']);
            if(rental.payInFull || rental.totalAmount <= vnp_Params['vnp_Amount']/100 + rental.pricePayed){
                await rentalService.update(req.query.id,{isPayment:'Đã thanh toán',paymentMethod:'VNPAY', pricePayed:rental.totalAmount})
                if(req.query.url.indexOf('?') !==-1){
                    return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}&success=true&id=${req.query.id}`)
                }
                else{
                    return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=true&id=${req.query.id}`)
                }
            }
            else{
                if(vnp_Params['vnp_Amount']/100>0){
                    rental.datePay.setMonth(rental.datePay.getMonth()+1)
                }
                await rentalService.update(req.query.id,{isPayment:'Thanh toán theo tháng',paymentMethod:'VNPAY', datePay:rental.datePay, payInFull:false})
                await rentalService.update2(req.query.id,vnp_Params['vnp_Amount']/100)
                if(req.query.url.indexOf('?') !==-1){
                    return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}&success=true&id=${req.query.id}`)
                }
                else{
                    return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=true&id=${req.query.id}`)
                }
            }
        }
        else{
            await rentalService.update(req.query.id,{isPayment:'Chưa thanh toán',paymentMethod:'VNPAY'})
            if(req.query.url.indexOf('?') !==-1){
                return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}&success=false&id=${req.query.id}`)
            }
            else{
                return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=false&id=${req.query.id}`)

            }
        }
        
    }

    
    
    
    async paymetnWithMoMO(req, res){
        const url = req.query.url
        //parameters
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const requestId = req.body.orderId +new Date().getTime();
        const orderId = requestId;
        const orderInfo = "Thanh toán đơn hàng thuê";
        const redirectUrl = `http://localhost:3000/rental/pay-momo-return/?url=${url}&id=${req.body.orderId}`;
        const ipnUrl = `http://localhost:3000/rental/pay-momo-return/?url=${url}&id=${req.body.orderId}`;
        const amount = req.body.totalAmount? req.body.totalAmount : 0;
        const requestType = "captureWallet"
        const extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        const rawSignature = "accessKey="+accessKey+"&amount=" + amount+ "&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
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
            lang: 'en',
            url:url
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
        const req2 = https.request(options, res2 => {
            
            res2.setEncoding('utf8');
            res2.on('data', (body) => {
                // gửi về client
                res.send(JSON.parse(body).payUrl)

            });
        })

        req2.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        // write data to request body
        req2.write(requestBody);
        req2.end();
    }

    async returnMomo (req, res){
        try {
            if(req.query.resultCode == 0){
                const rental=await rentalService.findById(req.query.id)
                if(rental.payInFull && rental.totalAmount == req.query.amount){
                    await rentalService.update(req.query.id,{isPayment:'Đã thanh toán',paymentMethod:'MOMO', pricePayed:rental.totalAmount})
                    if(req.query.url.indexOf('?') !==-1){
                        return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}&success=true&id=${req.query.id}`)
                    }
                    else{
                        return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=true&id=${req.query.id}`)

                    }
                }
                else{
                    if(req.query.amount>0){
                        rental.datePay.setMonth(rental.datePay.getMonth()+1)
                    }
                    await rentalService.update(req.query.id,{isPayment:'Thanh toán theo tháng',paymentMethod:'MOMO', datePay:rental.datePay, payInFull:false})
                    await rentalService.update2(req.query.id,req.query.amount)
                    if(req.query.url.indexOf('?') !==-1){
                        return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}&success=true&id=${req.query.id}`)
                    }
                    else{
                        return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=true&id=${req.query.id}`)

                    }
                }
            }
            else{
                await rentalService.update(req.query.id,{isPayment:'Chưa thanh toán',paymentMethod:'MOMO'})
                if(req.query.url.indexOf('?') !==-1){
                    return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}&success=false&id=${req.query.id}`)
                }
                else{
                    return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=false&id=${req.query.id}`)

                }
                
            }
        } catch (error) {
            console.log(error);
        }
        
    }
    async updateByCOD(req, res){
        try {
            const rental=await rentalService.findById(req.query.id)
            
            if(rental.payInFull){
                await rentalService.update(req.query.id,{isPayment:'Thanh toán toàn bộ',paymentMethod:'COD', datePay:rental.endDate, pricePayed:rental.totalAmount})
            }
            else{
                if(rental.pricePayed>0){
                    rental.datePay.setMonth(rental.datePay.getMonth()+1)
                }
                await rentalService.update(req.query.id,{isPayment:'Thanh toán theo tháng',paymentMethod:'COD', datePay:rental.datePay})
                await rentalService.update2(req.query.id,rental.priceMonth)
            }
            res.json({mes:'Thanh toán thành công',status:true})
        } catch (error) {
            console.log(error);
        }
    }
    async searchOrder(req, res){
        try {
            const condition = {...req.body}
            const {pageNumber=undefined} = req.query
            const {pageSize=undefined} = req.query
            if(!!condition){
                const result = await rentalService.find({...condition},pageNumber,pageSize)
                res.json(result)
            }
            else{
                res.json([])
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default new rentalController()