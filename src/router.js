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
                component: importComponent('DashboardLayout'),
                children: [
                    //Dashboard
                    {
                        path: "/dashboard",
                        name: "Dashboard",
                        meta: {title: 'Dashboard'},
                        component: importComponent('Dashboard'),
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