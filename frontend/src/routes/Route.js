import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import Dashboard from "../layout/Dashboard";
import AdminHome from "../adminPages/AdminHome";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PurchaseItem from "../adminPages/PurchaseItem";
import PurchaseList from "../adminPages/PurchaseList";
import AddProduction from "../adminPages/AddProduction";
import FinishedStock from "../adminPages/FinishedStock";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            { path: '/', element: <Home /> },
            {path:'/login',element:<Login/>},
            {path:'/signup',element:<Signup/>}
        ]
    },
    {
        path:"/admin",
        element:<Dashboard />,
        children:[
            {path:'',element:<AdminHome/>},
            {path:'purchase-item',element:<PurchaseItem/>},
            {path:'inventory',element:<PurchaseList/>},
            {path:'make-item',element:<AddProduction/>},
            {path:'ice-cream-stock',element:<FinishedStock/>},
        ]
    }
]);
export default router;