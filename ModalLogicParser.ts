
const OPERATOR_MARKER = "$";

enum SyntaxTypes {
    OPERATOR,
    VARIABLE
}

enum Operators {
    // generic
    ASSIGNMENT,

    // modal logic
    BOT,
    TOP,
    AND,
    OR,
    DIAMOND,
    BOX
}

interface SyntaxElement {
    type: SyntaxTypes;
    value: Operators | string;  // may need to be extended
}


const parseAsModalLogic = (statement: string): SyntaxElement[] => {
    let currentType: SyntaxTypes | undefined;
    let store: string | undefined;
    let parsedStatement: SyntaxElement[] = [];

    for (let c of [...statement, " "]) {
        switch (currentType) {
            case SyntaxTypes.OPERATOR:  // fall-through: operators and variables are actually parsed in the same manner
            case SyntaxTypes.VARIABLE:
                if (/\s/.test(c)) {
                    const operatorValue = Operators[store as keyof typeof Operators];
                    parsedStatement.push({
                        type: currentType,
                        value: operatorValue !== undefined ? operatorValue : store!
                    });
                    currentType = undefined;
                    store = undefined;
                } else {
                    store += c;
                }
                break;
            default:
                if (!isNaN(Number(c))) {
                    console.log("Expression cannot start with numeric: ", c);
                } else if (c === OPERATOR_MARKER) {
                    currentType = SyntaxTypes.OPERATOR;
                    store = "";
                } else {
                    currentType = SyntaxTypes.VARIABLE;
                    store = c;
                }
        }
    }
    return parsedStatement;
};