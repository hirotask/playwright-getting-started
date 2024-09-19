import test, { expect, Page } from "@playwright/test";

interface LoginParam {
	workspace: string
	email: string
	password: string
}

function isLoginParamValid(loginParam: LoginParam): boolean {
	return (loginParam.workspace !== '') && (loginParam.email !== '') && (loginParam.password !== '') 
}

async function loginToSlack(page: Page, loginParam: LoginParam): Promise<void> {
	if(!isLoginParamValid(loginParam)) throw new Error('Failed this test bacause of missing parameters')

	await page.goto('https://slack.com/intl/ja-jp/workspace-signin');
	await page.getByPlaceholder('your-workspace').click();
	await page.getByPlaceholder('your-workspace').fill(loginParam.workspace);
	await page.getByRole('button', { name: '続行する' }).click();
	await page.getByRole('link', { name: 'sign in with a password' }).click();
	await page.getByPlaceholder('name@work-email.com').click();
	await page.getByPlaceholder('name@work-email.com').fill(loginParam.email);
	await page.getByPlaceholder('Your password').click();
	await page.getByPlaceholder('Your password').fill(loginParam.password)
	await page.getByRole('button', { name: 'Sign In', exact: true }).click()
	page.on('dialog', async (dialog) => {
		dialog.dismiss()
	})
	await page.getByRole('link', { name: 'use Slack in your browser' }).click();
	await page.waitForLoadState()

	await page.waitForURL(/^https:\/\/app\.slack\.com\/client\/[A-Z0-9]+.$/)
}

const loginParam: LoginParam = {
	workspace: process.env.SLACK_WORKSPACE ?? '',
	email: process.env.SLACK_USER_EMAIL ?? '',
	password: process.env.SLACK_USER_PASSWORD ?? ''
}

test('slack login test', async ({ page }) => {
	await loginToSlack(page, loginParam)
})

//TODO: 
// test('slack file upload test', async ({ page }) => {
// 	await loginToSlack(page, loginParam)


// 	await page.getByLabel('Attach').click();
// 	await page.waitForLoadState()
// 	await page.getByRole('menuitem', { name: 'Upload from your computer' }).click();
// 	await page.waitForLoadState()
// 	await page.getByLabel('Message to general').setInputFiles('./resources/icon.png');
// 	await page.waitForLoadState()
// 	await page.getByLabel('Send now').click();
// 	expect(page.getByText('icon.png')).toBeVisible();
// })
