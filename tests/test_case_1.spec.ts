import {expect, test} from '@playwright/test'

test.describe('Test login flow', () =>{
    test.beforeEach(async({page})=>{
        await page.goto('http://localhost:4200/')
    })
    test('First test case - valid login', async({page}) =>{
        const username = 'mugaz@test.com'
        const passwordc = 'test123!'

        await page.getByRole('link', {name:'Forms'}).click()
        await page.getByText('Form Layouts').click()

        const nb_card = page.locator('nb-card', {hasText:'Using the Grid'})
        const email_id = nb_card.getByPlaceholder('Email')
        const password = nb_card.getByPlaceholder('Password')
        const radio_btn = nb_card.locator('label', {hasText:'Option 1'})
        const sign_in_btn = nb_card.getByRole('button', {name: 'Sign in'})
        const all_options = await nb_card.locator('nb-radio label').allTextContents()

        console.log(`available options are: ${all_options}`)

        for (const option of all_options){
            console.log(`available options is: ${option}`)
        }
        await email_id.fill(username)
        await password.fill(passwordc)
        // await radio_btn.click()
        await radio_btn.check({force: true})
        await sign_in_btn.click()

        await expect(email_id).toHaveValue(username)
        await expect(password).toHaveValue(passwordc)

    })

    test('Login screen - Invalid login', async({page})=>{
        const auth = page.getByTitle('Auth')
        const login_menu = page.getByTitle('Login')

        await auth.click()
        await login_menu.click()
        await expect (page.locator('h1', {hasText: 'Login'})).toBeVisible()

        const email_input = page.locator('#input-email')
        const pass_input = page.locator('#input-password')
        const login_btn = page.getByRole('button', {name: 'Log In'})

        await email_input.pressSequentially('mugaz@test.com', {delay: 500})
        await pass_input.pressSequentially('test', {delay: 10})
        await login_btn.click()

    })
})

test.describe('Home Screen', () =>{
    test.beforeEach(async({page})=>{
        await page.goto('http://localhost:4200/')
    })
    test('List option color switch test case', async({page}) =>{
        const colors = {
            'Light': 'rgb(255, 255, 255)',
            'Dark' : 'rgb(34, 43, 69)',
            'Cosmic': 'rgb(50, 50, 89)',
            'Corporate': 'rgb(255, 255, 255)'
        }
        const list_btn = page.locator('ngx-header nb-select .select-button')
        await list_btn.click()
        const color_options = page.locator('.option-list nb-option')
        const list_options = await color_options.allTextContents()
        console.log(`List options: ${list_options}`)

        const option_index = Object.keys(colors)

        for(const color in list_options){
            await color_options.filter({hasText: option_index[color]}).click()
            console.log(`Selected color: ${option_index[color]}`)
            await list_btn.click()
            await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', colors[option_index[color]])
        }
    })

    test('Get the tool tip details', async({page})=>{
        const overlay_menu = page.getByTitle('Modal & Overlays')
        await overlay_menu.click()
        const tooltip_menu = page.getByTitle('Tooltip')
        await tooltip_menu.click()
        page.getByRole('button', {name: 'Right'}).hover()
        await expect(page.getByText('This is a tooltip')).toBeVisible()
    })

    test('Handle window dialog box', async({page})=>{
       await page.getByTitle('Modal & Overlays').click()
       await page.getByTitle('Window').click()
       await page.getByRole('button', {name:'Open window with backdrop'}).click()
       await expect(page.getByText('Window content from template')).toBeVisible()

    //    page.on('dialog', dialog =>{
    //     expect(dialog.message()).toEqual('xxxx')
    //     dialog.accept()
    //    })
    })
})