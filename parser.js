import { tokenizer } from "./tokenizer";

export function parse_to_postfix(str) {
    const output = [];
    const stack = [];

    for (const token of tokenizer(str)) {
        if (token.type === 'operand') {
            output.push(token);
        } else if (token.type === 'operator') {
            while (stack.length > 0 && stack[stack.length - 1].type === 'operator' &&
                token.precedence <= stack[stack.length - 1].precedence) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else if (token.type === 'paren') {
            if (token.value === '(') {
                stack.push(token);
            } else {
                while (stack.length > 0 && stack[stack.length - 1].value !== '(') {
                    output.push(stack.pop());
                }
                if (stack.length > 0) {
                    stack.pop(); // Pop the '(' from the stack
                }
            }
        }
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }

    return output;
}


export function parse_to_elastic_search(str) {

    const post_fix = parse_to_postfix(str);

    const stack = []


    for (const token of post_fix) {
        if (token.type === 'operand') {
            stack.push({ "match": { 'field': token.value } })
        } else {
            const op1 = stack.pop();
            const op2 = stack.pop();

            stack.push(create_bool_query(token.value, op1, op2))

        }

    }

    return stack.pop();
}


function create_bool_query(operator, operand1, operand2) {
    if (operator == 'and') {
        return { "bool": { "must": [operand1, operand2] } }
    } else if (operator == 'or') {
        return { "bool": { "should": [operand1, operand2], "minimum_should_match": 1 } }
    }
}