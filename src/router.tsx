import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { RootLayout } from './components/RootLayout'
import { HomePage } from './pages/HomePage'
import { TestPage } from './pages/TestPage'
import { ResultPage } from './pages/ResultPage'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const testRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test',
  component: TestPage,
})

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/result',
  validateSearch: (search: Record<string, unknown>) => ({
    seed: typeof search.seed === 'string' ? search.seed : undefined,
  }),
  component: ResultPage,
})

const routeTree = rootRoute.addChildren([indexRoute, testRoute, resultRoute])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
