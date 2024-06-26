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
import orderRoute from './order.route'
import rentalRoute from './rental.route'
import newsRoute from './news.route'
import serviceRoute from './service.route'
import taskRoute from './task.route'
import warrantyRoute from './warranty.route'
import siteRoute from './site.route'
import cartRoute from './cart.route'
import commentRoute from './comment.route'

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
    app.use('/order', orderRoute)
    app.use('/rental', rentalRoute)
    app.use('/news', newsRoute)
    app.use('/service', serviceRoute)
    app.use('/task', taskRoute)
    app.use('/warranty', warrantyRoute)
    app.use('/site', siteRoute)
    app.use('/cart', cartRoute)
    app.use('/comment', commentRoute)
    app.use('/', (req, res) => {
        res.send('Hom page');
    })
};

export default routers;
