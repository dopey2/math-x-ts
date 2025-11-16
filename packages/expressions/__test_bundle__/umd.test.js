const puppeteer = require('puppeteer')

describe("UMD", () => {
    test("Testing that objects from packages are correctly defined ", async () => {
        let browser = null;
        let title = null;
        let isMathExpressionsDefined = null;
        let resultEvaluate = null;
        let resultMathNodeEvaluate = null;

        try {
            // browser = await puppeteer.launch({ headless: false })
            browser = await puppeteer.launch();

            const page = await browser.newPage();
            await page.goto(`file://${__dirname}/index.html`);

            title = await page.title()
            isMathExpressionsDefined = await page.evaluate("!!MathExpressions");

            /** Evaluate parsing functions **/
            resultEvaluate = await page.evaluate("MathExpressions.evaluate('1 + 2 * 3')");


            /** Evaluate math nodes **/
            resultMathNodeEvaluate = await page.evaluate(`
                const {Add, Constant, Multiply} = MathExpressions;
                
                const mathNode = new Add(
                    new Constant(3),
                    new Multiply(
                        new Constant(4),
                        new Constant(5),
                    )
                );
                
                mathNode.evaluate();
            `)


        } catch (err) {
            console.log(err);
        } finally {
            if(browser) {
                await browser.close()
            }


            expect(title).toBe("@math-x-ts/expressions-parser")
            expect(isMathExpressionsDefined).toBe(true)
            expect(resultEvaluate).toBe(7)
            expect(resultMathNodeEvaluate).toBe(23)
        }

    }, 10000);
})
