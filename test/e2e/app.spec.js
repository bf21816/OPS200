import express from "express";
import { expect } from "chai";
import path from "path";
import { chromium } from "playwright";

const app = express();
app.use(express.static(path.join(process.cwd(), "dist")));
app.use(express.static(path.join(process.cwd(), "public")));

const url = "http://localhost:3000";

describe("End to End Tests", function () {
    this.timeout(10000);

    let httpServer = null;
    let browser = null;
    let page = null;

    before(async () => {
        httpServer = app.listen(3000);
        browser = await chromium.launch();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(url);
    });

    afterEach(async () => {
        await page.close();
    });

    after(async () => {
        await browser.close();
        httpServer.close();
    });

    // This is where your code is going to go
    it("should contain a <h1> element for the page title", async () => {
        await page.waitForSelector("h1", { timeout: 2000 });
        const header = await page.locator("h1").textContent();
        expect(header).to.not.be.null;
        expect(header.trim()).to.equal("Mortgage Calculator");
    });

    it("should have input fields for principal, interest rate, and loan term", async () => {
        await page.waitForSelector("input[name='principal']", { timeout: 2000 });

        expect(await page.locator("input[name='principal']").count()).to.equal(1);
        expect(await page.locator("input[name='interestRate']").count()).to.equal(1);
        expect(await page.locator("input[name='loanTerm']").count()).to.equal(1);
    });

    it("should contain a <select> element with both Monthly and Quarterly options", async () => {
        await page.waitForSelector("select", { timeout: 2000 });
    
        const options = await page.locator("select[name='period'] option");
        expect(await options.count()).to.equal(2);

        const labels = await options.allTextContents();
        expect(labels).to.include("Monthly");
        expect(labels).to.include("Quarterly");
    });

    it("should contain a <button> element for calculation", async () => {
        await page.waitForSelector("button", { timeout: 2000 });
        const calculate = await page.locator("button").textContent();
        expect(calculate).to.not.be.null;
        expect(calculate.trim()).to.equal("Calculate");
    });
    
    it("should correctly calculate mortgage", async () => {
        await page.fill("input[name=principal]", "300000");
        await page.fill("input[name=interestRate]", "3.75");
        await page.fill("input[name=loanTerm]", "30");
        await page.selectOption("select[name=period]", "12");
        await page.click("button#calculate");
        await page.waitForSelector("#output", { timeout: 4000 });
        const outputText = await page.locator("#output").textContent();
        expect(outputText.trim()).to.equal("$1389.35");
    }).timeout(6500);
});