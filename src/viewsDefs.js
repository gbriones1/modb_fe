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

var viewsDefs = {
    "organization": organizations,
    "taxpayer": taxpayers,
    "brand": brands,
    "appliance": appliances,
    "storagetype": storagetypes,
    "storage": storage,
    "product": products,
    "provider": providers,
    "customer": customers,
    "employee": employees,
    "workbuy": workbuys,
    "order": orders,
    "work": works,
    "user": users,
}

export default viewsDefs;