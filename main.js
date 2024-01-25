import { tokenizer } from "./tokenizer";
import { parse_to_postfix, parse_to_elastic_search } from "./parser";


const test_input = `(Tiger OR "Big Cat") AND Jungle AND prowl`

console.log(JSON.stringify(parse_to_postfix(test_input), null, 2));
