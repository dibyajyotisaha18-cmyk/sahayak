import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { ParentLayout } from '@/components/layout/ParentLayout';
import { FamilyLayout } from '@/components/layout/FamilyLayout';
import { AppShell } from '@/components/layout/AppShell';
import Landing from '@/pages/Landing';
import Demo from '@/pages/Demo';
import Protect from '@/pages/Protect';
import Architecture from '@/pages/Architecture';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';
import ParentHome from '@/pages/parent/ParentHome';
import ParentTalk from '@/pages/parent/ParentTalk';
import Medicines from '@/pages/parent/Medicines';
import ParentFamily from '@/pages/parent/ParentFamily';
import ParentPay from '@/pages/parent/ParentPay';
import FamilyDashboard from '@/pages/family/FamilyDashboard';
import SafetyCircle from '@/pages/family/SafetyCircle';
import Wellbeing from '@/pages/family/Wellbeing';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <MarketingLayout />,
        children: [
          { path: '/', element: <Landing /> },
          { path: '/architecture', element: <Architecture /> },
          { path: '/privacy', element: <Privacy /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      { element: <AppShell />, children: [{ path: '/demo', element: <Demo /> }, { path: '/protect', element: <Protect /> }] },
      {
        path: '/parent', element: <ParentLayout />,
        children: [
          { index: true, element: <ParentHome /> },
          { path: 'talk', element: <ParentTalk /> },
          { path: 'medicines', element: <Medicines /> },
          { path: 'family', element: <ParentFamily /> },
          { path: 'pay', element: <ParentPay /> },
        ],
      },
      {
        path: '/family', element: <FamilyLayout />,
        children: [
          { index: true, element: <FamilyDashboard /> },
          { path: 'circle', element: <SafetyCircle /> },
          { path: 'wellbeing', element: <Wellbeing /> },
        ],
      },
    ],
  },
]);
