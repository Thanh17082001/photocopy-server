import userRoute from './user.route';
import brandRoute from './brand.route';
import categoryRoute from './category.route';
import typeRoute from './type.route';
import productRoute from './product.route';
import specificationsRoute from './specifications.route';
import entryReceiptRoute from './entryReceipt.route';
import supplierRoute from './supplier.route';
import companyRoute from './company.route';
import roleRoute from './role.route';
import staffRoute from './staff.route';
import accessoryRoute from './accessory.route';
import typeAcc from './type.Accroute'
import customerRoute from './customer.route'

const routers = (app) => {
    app.use('/user', userRoute);
    app.use('/brand', brandRoute);
    app.use('/category', categoryRoute);
    app.use('/type', typeRoute);
    app.use('/type-acc', typeAcc);
    app.use('/product', productRoute);
    app.use('/spacification', specificationsRoute);
    app.use('/entry-receipt', entryReceiptRoute);
    app.use('/supplier', supplierRoute);
    app.use('/company', companyRoute);
    app.use('/role', roleRoute);
    app.use('/staff', staffRoute);
    app.use('/accessory', accessoryRoute);
    app.use('/customer', customerRoute)
    app.use('/', (req, res) => {
        res.send('Hom page');
    })
};

export default routers;
