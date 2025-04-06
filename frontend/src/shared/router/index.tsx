import { createBrowserRouter } from 'react-router-dom';
import Main from '../../pages/main/Main.tsx';
import UserLayout from '../layouts/user/UserLayout.tsx';
import Registration from '../../pages/users/register/Registration.tsx';
import Login from '../../pages/users/login/Login.tsx';
import ProfilePage from '../../pages/users/profile/ProfilePage.tsx';
import ProfileLayout from '../layouts/profile/ProfileLayout.tsx';
import RegisteredRoute from '../routes/RegisteredRoute.tsx';
import UnRegisteredRoute from '../routes/UnRegisteredRoute.tsx';
import CoachProfilePage from '../../pages/coaches/coachProfile/CoachProfilePage.tsx';
import AddPortfolioPage from '../../pages/coaches/addPortfolio/AddPortfolioPage.tsx';
import CoachList from '../../modules/coaches/components/Coaches/CoachList.tsx';


export const router = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <Main/>
            },
            {
                path: '/coaches',
                element: <CoachList/>
            },
            {
                element: <UnRegisteredRoute />,
                children: [
                    {
                        path: '/registration',
                        element: <Registration/>
                    },
                    {
                        path: '/login',
                        element: <Login/>
                    },
                ]
            },
        ]
    },
    {
        element: <ProfileLayout />,
        children: [
            {
                element: <RegisteredRoute />,
                children: [
                    {
                        path: '/profile',
                        element: <ProfilePage/>
                    },
                    {
                        path: '/coach-profile',
                        element: <CoachProfilePage/>
                    },
                    {
                        path: '/add-portfolio',
                        element: <AddPortfolioPage/>
                    }
                ]
            }
        ]
    }
]);