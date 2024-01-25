export function* tokenizer(string) {
    const tokens = {
        'and': { type: 'operator', value: 'and', precedence: 2 },
        'or': { type: 'operator', value: 'or', precedence: 1 },
        ')': { type: 'paren', value: ')' },
        '(': { type: 'paren', value: '(' },

    };

    const parens = new Set(['(', ')'])
    const delims = new Set([' ', '\n', '(', ')']);

    let token_buffer = [];

    let in_string = false;

    for (const char of string) {
        if (delims.has(char) && !in_string) {
            if (token_buffer.length) {
                let token = token_buffer.join('').toLowerCase();
                yield tokens[token] || { type: 'operand', value: token };

                token_buffer.length = 0;
            }
            if (parens.has(char)) {
                yield tokens[char]
            }

        } else if (char === '"') {
            in_string = !in_string;
        } else {
            token_buffer.push(char);
        }
    }

    if (token_buffer.length > 0) {
        let token = token_buffer.join('').toLowerCase();
        yield tokens[token] || { type: 'operand', value: token };
    }
}