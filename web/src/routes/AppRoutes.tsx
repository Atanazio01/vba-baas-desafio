import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { GatewayRoute } from './GatewayRoute'
import { ROUTES } from './paths'
import LoginPage from '../pages/Login'
import SignupPage from '../pages/Signup'
import OnboardingPage from '../pages/Onboarding'
import DashboardPage from '../pages/Dashboard'
import PublicCheckoutPage from '../pages/PublicCheckout'
import NotFoundPage from '../pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      <Route
        path={ROUTES.LOGIN}
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.SIGNUP}
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />

      <Route path="/checkout/:publicId" element={<PublicCheckoutPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
        <Route element={<GatewayRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  )
}
