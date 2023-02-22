
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // 模拟服务端路由
  {
    url: '/async/menus',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          meuns: [
            {
              path: '/permission',
              component: Layout,
              redirect: '/permission/page',
              alwaysShow: true, // will always show the root menu
              name: 'Permission',
              meta: {
                title: 'Permission',
                icon: 'lock',
                roles: ['admin', 'editor'] // you can set roles in root nav
              },
              children: [
                {
                  path: 'page',
                  component: () => import('@/views/permission/page'),
                  name: 'PagePermission',
                  meta: {
                    title: 'Page Permission',
                    roles: ['admin'] // or you can only set roles in sub nav
                  }
                },
                {
                  path: 'directive',
                  component: () => import('@/views/permission/directive'),
                  name: 'DirectivePermission',
                  meta: {
                    title: 'Directive Permission'
                    // if do not set roles, means: this page does not require permission
                  }
                },
                {
                  path: 'role',
                  component: () => import('@/views/permission/role'),
                  name: 'RolePermission',
                  meta: {
                    title: 'Role Permission',
                    roles: ['admin']
                  }
                }
              ]
            },

            {
              path: '/icon',
              component: Layout,
              children: [
                {
                  path: 'index',
                  component: () => import('@/views/icons/index'),
                  name: 'Icons',
                  meta: { title: 'Icons', icon: 'icon', noCache: true }
                }
              ]
            }
          ]
        }
      }
    }
  }
]
