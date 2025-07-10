import { LIMIT, PAGE, SEARCH, SORT } from "../db/configs/index.js";
import SqlString from "sqlstring";
const { escape } = SqlString

class Pagination {

    static query = (params) => {

        const options = {
            ...{
                table: "",
                selectColumns: [],
                conditions: {
                    operator: 'WHERE', value: ''
                },
                sort: { column: ["id"], value: 'ASC' },
                page: PAGE,
                limit: LIMIT,
                search: SEARCH,
            },
            ...params,
        }


        const {
            table,
            selectColumns,
            conditions,
            page,
            limit,
            search,
            sort
        } = options

        /**
         * Declare No value param
         */
        const noValue = ""

        /**
         * Select Columns from table {table}
         * @var {String} table
         * @param {Array} selectColumns
         * @return {String} `column1, column2`
         */
        const columns = Array.from(selectColumns).map(column => column).join(", ")


        /**
         * Search value from table {table}
         * @var {String} table
         * @param {String} search.value
         * @return {Boolean} true, false
         */
        const issetSearch = (
            search.value != null
            && search.value != "null"
            && search.value != ""
            && search.value != undefined
        )

        /**
         * Sorting Data
         * @param {String} sort.value
         * @return {Boolean} true, false
         */
        const issetSort = (
            sort.value != null
            && sort.value != "null"
            && sort.value != ""
            && sort.value != undefined
        )

        /**
         * Searching Colums from {table}
         * @param {String} search.column
         * @return {String} `column1 ILIKE '%value%' OR column2 ILIKE '%value%'`
         */
        const searches = Array.from(search.column).map(column =>
            `${column} ilike ${escape(`%${search.value}%`)}`
        ).join(` ${search.operator} `)

        /**
         * Sorting Data from {table}
         * @param {String} sort.column
         * @return {String} `column1, column2`
         */
        const sortColumns = sort.column.length > 0 ? sort.column : ["id"];
        const sorts = Array.from(sortColumns).map(column => column).join(", ")
        
        /**
         * Initalize conditions
         * @param {String} conditions.value
         * @return {Boolean} true, false
         */
        const issetcondition = (
            conditions.value != null
            && conditions.value != "null"
            && conditions.value != ""
            && conditions.value != undefined
        )

        /**
         * String Query Returning
         * @example `SELECT column1, column2 FROM table WHERE (column1 ILIKE '%value%' OR column2 ILIKE '%value%') ORDER BY column1 ASC LIMIT 10 OFFSET 0`
         * @returns {String} query
         */
        const query = (
            `SELECT ${columns} FROM ${table}
            ${issetSearch
                ? `WHERE ${issetcondition
                    ? `${conditions.value} AND`
                    : ``} (${searches})`
                : issetcondition
                    ? `${conditions.operator} ${conditions.value}`
                    : noValue
            }
            ${issetSort
                ? `ORDER BY ${sorts} ${sort.value}`
                : noValue
            }
            ${typeof limit === 'number' || Number(limit) && limit != -1
                ? `LIMIT ${limit}`
                : noValue
            }
            ${typeof limit === 'number' || Number(limit) && page
                ? `OFFSET ${(page - 1) * limit}`
                : noValue
            }`
        )
        
        return query
    }
}

export const {
    query
} = Pagination