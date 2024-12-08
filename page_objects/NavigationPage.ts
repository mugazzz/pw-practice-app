import {expect, Page, test} from '@playwright/test'

export class Navigation{

    readonly page:Page

    constructor(page:Page){
        this.page = page
    }

    async formLayoutPage(){
        await this.page.getByRole('link', { name: 'Forms' }).click()
        await this.page.getByText('Form Layouts').click()
    }

    async loginAuthPage(){
        const auth = this.page.getByTitle('Auth')
        const login_menu = this.page.getByTitle('Login')
        await auth.click()
        await login_menu.click()
        await expect(this.page.locator('h1', { hasText: 'Login' })).toBeVisible()

    }

    async modalOverlayToolTip(){
        const overlay_menu = this.page.getByTitle('Modal & Overlays')
        await overlay_menu.click()
        const tooltip_menu = this.page.getByTitle('Tooltip')
        await tooltip_menu.click()
    }

    async tableSmartTablePage(){
        await this.page.getByTitle('Tables & Data').click()
        await this.page.getByTitle('Smart Table').click()
    }

    async calenderPage(){
        await this.page.getByTitle('Extra Components').click()
        await this.page.getByTitle('Calendar').click()
    }

    async modalOverlayDialog(){
        await this.page.getByTitle('Modal & Overlays').click()
        await this.page.getByTitle('Window').click()
    }

}