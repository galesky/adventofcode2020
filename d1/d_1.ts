/* Before you leave, the Elves in accounting just need you to fix your expense report (your puzzle input); apparently, something isn't quite adding up.

Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together. 
*/

import { entries } from './d_1_assets'

const entries_set = new Set(entries)

for (const entry of entries) {
    if (entries_set.has(2020 - entry)) {
        console.log(entry*(2020-entry))
        break
    }
}
