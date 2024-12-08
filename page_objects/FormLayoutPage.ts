import {expect, Page, test} from '@playwright/test'
import { Navigation } from './NavigationPage'
import { PageManager } from './PageManager'
import { HelperBase } from './HelperBase'

export class FormLayoutPage extends HelperBase{

    constructor(page:Page){
       super(page)
    }

    /**
     * Function to validate the valid login flow
     * @param username must be a string
     * @param pass must be a string
     */

    async validLoginCase(username:string, pass:string){

        const nb_card = this.page.locator('nb-card', { hasText: 'Using the Grid' })
        const email_id = nb_card.getByPlaceholder('Email')
        const password = nb_card.getByPlaceholder('Password')
        const radio_btn = nb_card.locator('label', { hasText: 'Option 1' })
        const sign_in_btn = nb_card.getByRole('button', { name: 'Sign in' })
        const all_options = await nb_card.locator('nb-radio label').allTextContents()
        console.log(`available options are: ${all_options}`)

        await this.waitForNumberOfSeconds(2)

        for (const option of all_options) {
            console.log(`available options is: ${option}`)
        }
        await email_id.fill(username)
        await password.fill(pass)
        // await radio_btn.click()
        await radio_btn.check({ force: true })
        await sign_in_btn.click()
        await expect(email_id).toHaveValue(username)
        await expect(password).toHaveValue(pass)
    }
}