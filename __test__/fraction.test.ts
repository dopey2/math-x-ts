import Constant from "../src/math-node/Constant";
import Fraction from "../src/math-node/Fraction";
import Add from "../src/math-node/Add";
import MathNode, {MathNodeType} from "../src/math-node/MathNode";

describe("Fraction with constant", () => {
    it("6 / 3", () => {
        const expression = new Fraction(new Constant(6) as MathNode, new Constant(3) as MathNode);

        const solved = expression.next();
        expect(solved).toBeDefined();
        expect(solved?.atomic).toBe(true);
        expect(solved.type).toBe(MathNodeType.constant);
        expect(solved.value).toBe(2);
        expect(solved.toString()).toBe("2");
    });
});

describe("Fraction with operations", () => {
    it("(3 + 5) / (1 + 1)", () => {

        const add3And5 = new Add(new Constant(3) as MathNode, new Constant(5) as MathNode) as MathNode;
        const add1And1 = new Add(new Constant(1) as MathNode, new Constant(1) as MathNode) as MathNode;
        const expression = new Fraction(add3And5, add1And1);

        const newFraction = expression.next() as Fraction;
        expect(newFraction).toBeDefined();
        expect(newFraction?.atomic).toBe(false);
        expect(newFraction?.getNumerator()).toBeDefined();
        expect(newFraction?.getDenominator()).toBeDefined();
        expect(newFraction?.getNumerator().value).toBe(8);
        expect(newFraction?.getDenominator().value).toBe(2);

        const solved = newFraction.next();

        expect(solved).toBeDefined();
        expect(solved?.atomic).toBe(true);
        expect(solved?.type).toBe(MathNodeType.constant);
        expect(solved?.value).toBe(4);
        expect(solved?.toString()).toBe("4");
    });
});


describe("Add fraction and constant", () => {
    it("{4 / 2} + 6", () => {

        const A = new Constant(4);
        const B = new Constant(2);
        const C = new Constant(6);

        const frac = new Fraction(A, B);
        const expression = new Add(frac, C)

        const step1 = expression.next();
        expect(step1).toBeDefined();
        expect(step1?.atomic).toBe(false);
        expect(step1?.type).toBe(MathNodeType.add);

        // expect(step1?.fraction?.d.constant).toBeDefined();
        // expect(newFraction?.fraction?.n.constant).toBeDefined();
        // expect(newFraction?.fraction?.n.constant?.value).toBe(8);
        // expect(newFraction?.fraction?.d.constant?.value).toBe(2);
        //
        // const solved = newFraction.next();
        //
        // expect(solved).toBeDefined();
        // expect(solved?.atomic).toBe(true);
        // expect(solved?.constant).toBeDefined();
        // expect(solved?.constant?.value).toBe(4);
        // expect(solved?.toString()).toBe("4");
    });
});