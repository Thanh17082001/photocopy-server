import warrantyService from "../service/warranty.service";
import moment from "moment/moment";
import accessoryService from "../service/accessory.service";
class warrantyController{
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
                     const result=await warrantyService.create(data)
                     if(!!result){
                         const accessorys = req.body.accessorys
                         accessorys.forEach(async (product) =>{
                            await accessoryService.updateAfterOrder(product.accessoryId,{quantity:product.quantity})
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
            const result = await warrantyService.find({},pageNumber,pageSize)
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
                const result = await warrantyService.findById(id)
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
                        const rental= await warrantyService.findById(id)
                        if( rental.status=='Đang vận chuyển' || rental.status=='Đã giao hàng' || rental.status=='Đang sử dụng'){
                            res.json({mes:'Không thể hủy đơn',status:false})
                        }
                        else{
                            const result = await warrantyService.update(id, {status:data.status})
                            return res.json({mes:'Cập nhật thành công', status:true, data:result})
                        }
    
                    }
                    const result = await warrantyService.update(id, data)
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
        const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
    
        let tmnCode = 'M0UIOUJQ';
        let secretKey ='QAHUEZEOIRUDZATPCTITIGLAKLKOHGHL';
        let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        let returnUrl = `http://localhost:3000/warranty/payment/?url=${url}`
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        let orderId = req.body.orderId;
        let amount = req.body.totalAmount || 0; // thêm tiền ở đây
        let orderInfo = req.body.orderDescription || 'Thanh toán hóa đơn';
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
            const order = await warrantyService.findById(vnp_Params['vnp_TxnRef'])
            await warrantyService.update(vnp_Params['vnp_TxnRef'],{isPayment:true,paymentMethod:'VNPAY', pricePayed: order.totalAmount, warrantyExpires:true})
            return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=true&id=${vnp_Params['vnp_TxnRef']}`)    
        }
        else{
            await warrantyService.update(vnp_Params['vnp_TxnRef'],{isPayment:true,paymentMethod:'VNPAY', pricePayed: order.totalAmount, warrantyExpires:true})
            return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=false&id=${vnp_Params['vnp_TxnRef']}`)
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
            const result = await warrantyService.findByDate(day,month,year,field,pageNumber,pageSize)
            res.json(result);
            
            
        } catch (error) {
            console.log(error);
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
        const orderInfo = "Thanh toán đơn hàng";
        const redirectUrl = `http://localhost:3000/warranty/pay-momo-return/?url=${url}&id=${req.body.orderId}`;
        const ipnUrl = `http://localhost:3000/warranty/pay-momo-return/?url=${url}&id=${req.body.orderId}`;
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
                await warrantyService.update(req.query.id,{isPayment:true,paymentMethod:'MOMO', pricePayed:req.query.amount, warrantyExpires:true})
                return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=true&id=${req.query.id}`)
            }
            else{
                await warrantyService.update(req.query.id,{isPayment:false,paymentMethod:'MOMO', pricePayed:0, warrantyExpires:true})
                return res.redirect(`http://localhost:3001/${req.query.url ? req.query.url :''}/?success=false&id=${req.query.id}`)
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    
}

export default new warrantyController()