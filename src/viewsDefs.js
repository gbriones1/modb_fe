import appliances from "./views/appliances";
import brands from "./views/brands";
import customers from "./views/customers";
import employees from "./views/employees";
import orders from "./views/orders";
import organizations from "./views/organizations";
import products from "./views/products";
import providers from "./views/providers";
import storagetypes from "./views/storagetypes";
import storage from "./views/storage";
import taxpayers from "./views/taxpayers";
import users from "./views/users";
import workbuys from "./views/workbuys";
import works from "./views/works";
import prices from "./views/prices";
import storagebuys from "./views/storagebuy";
import storage_orders from "./views/orders_storagebuy";
import works_by_date from "./views/works_by_date";

var viewsDefs = {
    "organization": organizations,
    "taxpayer": taxpayers,
    "brand": brands,
    "appliance": appliances,
    "storagetype": storagetypes,
    "storage": storage,
    "product": products,
    "price": prices,
    "provider": providers,
    "customer": customers,
    "employee": employees,
    "workbuy": workbuys,
    "storagebuy": storagebuys,
    "work_order": orders,
    "storage_order": storage_orders,
    "work": works,
    "work_by_date": works_by_date,
    "user": users,
}

export default viewsDefs;