import bcryptjs from "bcryptjs";
const { hash, genSalt, compare } = bcryptjs

import { client } from "../db/configs/pg.config.js";
import { Response } from "../helpers/response-data.js";
import { Pagination } from "../helpers/paginations.js";

const response  = new Response()
const PAGE      = new Pagination()


export const getData = async ( request ) =>
{
    const { page, limit, search, sort } = request
    const count = await client.query(`SELECT count(id) from public.users`)
    const total = count.rows[0].count || 0
    const query = PAGE.query({
        table: 'public.users',
        selectColumns: ["id", "name", "password"],
        conditions: {
            operator: 'WHERE',
            value: ''
        },
        page: page,
        limit: limit,
        search: {
            column: [ 'name' ],
            value: search,
            operator: "or",
            withWere: true
        },
        sort: {
            column: [ "name"],
            value: sort
        },
    })

    return await client.query(query, []).then(
        result => {
            const data = {
                data: result.rows,
                count: total,
                show: result.rowCount
            }
            return data
        }
    ).catch(
        reason => console.log(reason)
    )
};


export const getDataDetail = async ( { id } ) =>
{
    return await client.query(
        `SELECT id, name, password from public.users where id=$1`, [id]
    ).then(
        async result => {
            return response.success(
                result.rows
            );
        }
    ).catch(
        reason => console.log(reason)
    )
};


export const updateData = async ( request ) =>
{
    const { id, oldPassword, newPassword } = request;
    const currentUser       = await client.query("select id, password from public.users where id = $1", [id]);
    const currentPassword   = currentUser.rows[0].password;
    const isMatch           = await compare(oldPassword, currentPassword);

    const passwordSalt      = await genSalt(10)
    const password          = await hash(newPassword, passwordSalt);

    if (!isMatch)
        return response.insetFailed({ message: "Old Password is not match." });

    return await client.query(
        `UPDATE public.users SET "password"=$1 WHERE id=$2;`,
        [password, id]
    ).then(
        result =>
        {
            if (result.rowCount < 0)
                return result
            return response.insetSuccess({ message: "Update Success." })
        }
    ).catch(
        reason =>
        {
            if (reason.code == "23505")
                return response.insetFailed({ message: reason.detail });

            console.log(reason)
            return reason
        }
    )
};