import { expect, test } from '@playwright/test'
import { PageManager } from '../page_objects/PageManager'

test.describe('Test login flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/')
    })
    test('First test case - valid login', async ({ page }) => {
        const pm = new PageManager(page)
        await pm.navigateTo.formLayoutPage()
        await pm.formLayoutPageCases.validLoginCase('mugaz@test.com', 'Test123')
    })

    test('Login screen - Invalid login', async ({ page }) => {
        const pm = new PageManager(page)
        await pm.navigateTo.loginAuthPage()
        const email_input = page.locator('#input-email')
        const pass_input = page.locator('#input-password')
        const login_btn = page.getByRole('button', { name: 'Log In' })
        await email_input.pressSequentially('mugaz@test.com', { delay: 500 })
        await pass_input.pressSequentially('test', { delay: 10 })
        await login_btn.click()

    })
})

test.describe('Select options and dialog box handing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/')
    })
    test('List option color switch test case', async ({ page }) => {
        const colors = {
            'Light': 'rgb(255, 255, 255)',
            'Dark': 'rgb(34, 43, 69)',
            'Cosmic': 'rgb(50, 50, 89)',
            'Corporate': 'rgb(255, 255, 255)'
        }
        const list_btn = page.locator('ngx-header nb-select .select-button')
        await list_btn.click()
        const color_options = page.locator('.option-list nb-option')
        const list_options = await color_options.allTextContents()
        console.log(`List options: ${list_options}`)

        const option_index = Object.keys(colors)

        for (const color in list_options) {
            await color_options.filter({ hasText: option_index[color] }).click()
            console.log(`Selected color: ${option_index[color]}`)
            await list_btn.click()
            await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', colors[option_index[color]])
        }
    })

    test('Get the tool tip details', async ({ page }) => {
        const pm = new PageManager(page)
        await pm.navigateTo.modalOverlayToolTip()
        page.getByRole('button', { name: 'Right' }).hover()
        await expect(page.getByText('This is a tooltip')).toBeVisible()
    })

    test('Handle webpage dialog box', async ({ page }) => {
        const pm = new PageManager(page)
        await pm.navigateTo.modalOverlayDialog()
        await page.getByRole('button', { name: 'Open window with backdrop' }).click()
        await expect(page.getByText('Window content from template')).toBeVisible()
    })

    test('Handling window dialog box', async ({ page }) => {
        page.on('dialog', dialog =>{
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
           })
           const pm = new PageManager(page)
        await pm.navigateTo.tableSmartTablePage()
        await page.getByRole('table').locator('tr', {hasText:'mdo@gmail.com'}).locator('.nb-trash').click()
        await expect(page.getByRole('table').locator('tr', {hasText:'mdo@gmail.com'})).not.toBeVisible()
    })
})

test.describe('Table element handling', ()=>{
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/')
        const pm = new PageManager(page)
        await pm.navigateTo.tableSmartTablePage()
    })
    test('Get a cell value for a row', async({page})=>{
        const row = page.getByRole('row', {name: '3'})
        const coloumnValue = await row.locator('td').nth(5).textContent()
        expect(coloumnValue).toEqual('twitter@outlook.com')
    })
    test('Edit the table content', async({page})=>{
        const row = page.getByRole('row', {name: '3'})
        await row.locator('td').first().locator('.nb-edit').click()

        const rowEdit = page.locator('[class = "ng2-smart-row ng-star-inserted selected"]')
        await rowEdit.locator('td').nth(5).click()
        await rowEdit.locator('td').nth(5).locator('input-editor').locator('input').clear()
        await rowEdit.locator('td').nth(5).locator('input-editor').locator('input').fill('mugaz@test.com')
        await rowEdit.locator('.nb-checkmark').click()

        const coloumnValue = await row.locator('td').nth(5).textContent()
        expect(coloumnValue).toEqual('mugaz@test.com')

    })
})

test.describe('Date Picker cases', () =>{
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/')
        const pm = new PageManager(page)
        await pm.navigateTo.calenderPage()
    })
    test('Select a date and confirm the selected date', async({page})=>{
        let date = new Date()
        date.setDate(date.getDate()+100)
        const expDate = date.getDate().toString()
        const expMon = date.toLocaleString('En-US', {month:'short'})
        const expYear = date.getFullYear()
        const dateToAssert = `${expMon} ${expDate}, ${expYear}`
        console.log('Acutal Date: '+ dateToAssert)
        const expmonyear = `${date.toLocaleString('En-US', {month:'long'})} ${expYear}`
        console.log('Acutal Long month: '+ expmonyear)

        const calCont = page.locator('.calendar-container').first()
        let actMonth = await calCont.locator('nb-calendar-view-mode').getByRole('button').textContent()
        while(!actMonth.includes(expmonyear)){
            await calCont.locator('.next-month').click()
            actMonth = await calCont.locator('nb-calendar-view-mode').getByRole('button').textContent()
            console.log('Acutal Month: '+ actMonth)
        }
        await calCont.locator('.cell-content', {hasText: expDate}).click()
        await expect(calCont.locator('.subtitle')).toContainText(dateToAssert)
    })
})

test.describe('Slider handle cases', () =>{
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:4200/')
    })
    test('Slider click using evaluate', async({page})=>{
        const sliderCir = page.locator('[tabtitle="Temperature"]').locator('circle')
        await sliderCir.evaluate(node =>{
            node.setAttribute('cx', '246')
            node.setAttribute('cy', '213')
        })
        await sliderCir.click()

        await expect(page.locator('[tabtitle="Temperature"]').locator('[class ="value temperature h1"]')).toContainText('29')
    })
    test('Slider using mouse actions', async({page})=>{
        const circleBox = page.locator('[tabtitle="Temperature"]').locator('.svg-container')
        await circleBox.scrollIntoViewIfNeeded()
        const box = circleBox.boundingBox()
        const x = (await box).x+(await box).width/2
        const y = (await box).y+(await box).height/2
        
        await page.mouse.move(x, y)
        await page.mouse.down()
        await page.mouse.move(x+100, y+45)
        await page.mouse.up()

        await expect(page.locator('[tabtitle="Temperature"]').locator('[class ="value temperature h1"]')).toContainText('28')
    })
})

test.describe('Drag and drop cases', () =>{
    test.beforeEach(async ({ page }) => {
        await page.goto("https://www.globalsqa.com/demo-site/draganddrop/")
        await expect(page.locator('li', {hasText:'Photo Manager'})).toBeVisible()
    })

    test('Using Drag and drop function', async({page})=>{
        const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
        await frame.locator('h5', {hasText:'High Tatras 2'}).dragTo(frame.locator('#trash'))
        await expect(frame.locator('#trash').locator('h5')).toContainText('High Tatras 2')
    })

    test('Drag and drop using mouse', async({page})=>{
        const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
        await frame.locator('h5', {hasText:'High Tatras 2'}).hover()
        await page.mouse.down()
        await frame.locator('#trash').hover()
        await page.mouse.up()
        await expect(frame.locator('#trash').locator('h5')).toContainText('High Tatras 2')
    })
})