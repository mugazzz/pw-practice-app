import { state } from '@angular/animations';
import {expect, test} from '@playwright/test';
// import {tags} from '../test_data/tags.json'

test.describe('Api validations', () =>{
    test.beforeEach(async ({page})=>{
        await page.route('*/**/api/tags', async route =>{
            const tags = {
            "tags": [
                "Mugaz",
                "Testing",
                "Tags"
            ]
            }
            await route.fulfill({
                body: JSON.stringify(tags)
            })
        })

        await page.route('*/**/api/articles*', async route =>{
            const respon = await route.fetch()
            const resBody = await respon.json()
            resBody.articles[0].title = 'Test Title'
            resBody.articles[0].description = 'Test Description'
            await route.fulfill({
                body: JSON.stringify(resBody)
            })
        })
        
        await page.goto('https://conduit.bondaracademy.com/')
    })
    test ('Loading the site url', async({page}) =>{
        await expect(page.locator('p', {hasText: 'Popular Tags'})).toBeVisible()
        const actualTags = (await page.locator('[class = "tag-default tag-pill"]').allTextContents()).toString()
        expect(actualTags).toEqual(' Mugaz , Testing , Tags ')
    })
    test('Intercept update the received response', async ({page})=>{
        await expect(page.locator('[class = "nav-link active"]').first()).toHaveText(' Global Feed ')
        // await page.locator('app-article-preview').first().locator('h1').click()
        await expect(page.locator('app-article-preview').first().locator('h1')).toContainText('Test Title')
        await expect(page.locator('app-article-preview').first().locator('p')).toContainText('Test Description')
    } )
})