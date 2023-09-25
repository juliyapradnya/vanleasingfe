import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        
           // Login
            {
                path: "/login",
                name: "Login",
                meta: {title: 'Login'},
                component: importComponent('Login'),
            },
            {
                path: "/",
                component: importComponent('SuperAdminLayout'),
                children: [
                    //Dashboard
                    {
                        path: "/superadmindashboard",
                        name: "SuperAdminDashboard",
                        meta: {title: 'SuperAdminDashboard'},
                        component: importComponent('Dashboard'),
                    },

                    //available stock
                    {
                        path: "/superadminavailablestock",
                        name: "SuperAdminAvailableStock",
                        meta: {title: 'SuperAdminAvailableStock'},
                        component: importComponent('DataMaster/AvailableStock'),
                    },

                    //Employee
                    {
                        path: "/superadminsalesorder",
                        name: "SuperAdminSalesOrder",
                        meta: {title: 'SuperAdminSalesOrder'},
                        component: importComponent('DataMaster/SalesOrder'),
                    },

                    //Project
                    {
                        path: "/superadminpurchaseorder",
                        name: "SuperAdminPurchaseOrder",
                        meta: {title: 'SuperAdminPurchaseOrder'},
                        component: importComponent('DataMaster/PurchaseOrder'),
                    },

                    //Ticket
                    {
                        path: "/superadminothercost",
                        name: "SuperAdminOtherCost",
                        meta: {title: 'SuperAdminOtherCost'},
                        component: importComponent('DataMaster/OtherCost'),
                    },

                    //Task
                    {
                        path: "/superadminotherincome",
                        name: "SuperAdminOtherIncome",
                        meta: {title: 'SuperAdminOtherIncome'},
                        component: importComponent('DataMaster/OtherIncome'),
                    },

                    //Assignee
                    {
                        path: "/superadminrehiringorder",
                        name: "SuperAdminRehiringOrder",
                        meta: {title: 'SuperAdminRehiringOrder'},
                        component: importComponent('DataMasterSuperAdmin/RehiringOrder'),
                    },

                    {
                        path: "/superadminvehiclesold",
                        name: "SuperAdminVehicleSold",
                        meta: {title: 'SuperAdminVehicleSold'},
                        component: importComponent('DataMasterSuperAdmin/VehicleSold'),
                    },

                    {
                        path: "/superadminvehiclecard",
                        name: "SuperAdminVehicleCard",
                        meta: {title: 'SuperAdminVehicleCard'},
                        component: importComponent('DataMaster/VehicleCard'),
                    },

                    {
                        path: "/superadmincompilationdb",
                        name: "SuperAdminCompilationDB",
                        meta: {title: 'SuperAdminCompilationDB'},
                        component: importComponent('DataMaster/CompilationDB'),
                    },

                    {
                        path: "/superadminmileage",
                        name: "SuperAdminMileage",
                        meta: {title: 'SuperAdminMileage'},
                        component: importComponent('DataMaster/Mileage'),
                    },

                    {
                        path: "/superadminlaporan",
                        name: "SuperAdminLaporan",
                        meta: {title: 'SuperAdminLaporan'},
                        component: importComponent('DataMaster/Laporan'),
                    },
                ]
            },

            {
                path: "/",
                component: importComponent('DashboardLayout'),
                children: [
                    //Dashboard
                    {
                        path: "/dashboard",
                        name: "Dashboard",
                        meta: {title: 'Dashboard'},
                        component: importComponent('Dashboard'),
                    },

                    //available stock
                    {
                        path: "/availablestock",
                        name: "AvailableStock",
                        meta: {title: 'AvailableStock'},
                        component: importComponent('DataMaster/AvailableStock'),
                    },

                    //Employee
                    {
                        path: "/salesorder",
                        name: "SalesOrder",
                        meta: {title: 'SalesOrder'},
                        component: importComponent('DataMaster/SalesOrder'),
                    },

                    //Project
                    {
                        path: "/purchaseorder",
                        name: "PurchaseOrder",
                        meta: {title: 'PurchaseOrder'},
                        component: importComponent('DataMaster/PurchaseOrder'),
                    },

                    //Ticket
                    {
                        path: "/othercost",
                        name: "OtherCost",
                        meta: {title: 'OtherCost'},
                        component: importComponent('DataMaster/OtherCost'),
                    },

                    //Task
                    {
                        path: "/otherincome",
                        name: "OtherIncome",
                        meta: {title: 'OtherIncome'},
                        component: importComponent('DataMaster/OtherIncome'),
                    },

                    //Assignee
                    {
                        path: "/rehiringorder",
                        name: "RehiringOrder",
                        meta: {title: 'RehiringOrder'},
                        component: importComponent('DataMaster/RehiringOrder'),
                    },

                    {
                        path: "/vehiclesold",
                        name: "VehicleSold",
                        meta: {title: 'VehicleSold'},
                        component: importComponent('DataMaster/VehicleSold'),
                    },

                    {
                        path: "/vehiclecard",
                        name: "VehicleCard",
                        meta: {title: 'VehicleCard'},
                        component: importComponent('DataMaster/VehicleCard'),
                    },

                    {
                        path: "/compilationdb",
                        name: "CompilationDB",
                        meta: {title: 'CompilationDB'},
                        component: importComponent('DataMaster/CompilationDB'),
                    },

                    {
                        path: "/mileage",
                        name: "Mileage",
                        meta: {title: 'Mileage'},
                        component: importComponent('DataMaster/Mileage'),
                    },

                ]
            },

            
        {
            path: '*',
            redirect: '/'
        },

    ]
});

//set judul


export default router;