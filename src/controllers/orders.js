const { successFormatter, errorFormatter } = require('../utils/hellpers');
const pool = require('../utils/poolpq').connectTo();

const getOrders = async (req, res) => {
    try {
        const data = await pool.pq('select * from public.orders');
        successFormatter(res, { message: data });
    } catch (e) {
        errorFormatter(res, { statusCode: 500, message: 'Server error!' })
    }
}
const getOrderById = async (req, res) => {
    try {
        const data = await pool.pq('select * from public.orders where id = $1', [req.params?.id], true);
        if(data) successFormatter(res, { message: data });
        else errorFormatter(res, { statusCode: 404, message: 'Order did not found!'});
    } catch (e) {
        errorFormatter(res, { statusCode: 500, message: 'Server error!' })
    }
}
const updateOrders = async (req, res) => {
    try {
        const { id } = req.params, data = req.body;

        await pool.pq('update public.orders set (name, phone, status, address) = ($1, $2, $3, $4) where id = $5',
            [data.name, data.phone, data.status, data.address, id]);
        successFormatter(res);
    } catch (e) {
        console.log(e)
        errorFormatter(res, { statusCode: 500, message: 'Server error!' })
    }
}

const addOrders = async (req, res) => {
    try {
        const {data} = req.body;
        await pool.pq(`insert into orders (name, phone, address, createdat, status) values ($1, $2, $3, $4, $5)`,
            [data.name, data.phone, data.address, new Date(), 'new'])
        successFormatter(res)
    } catch (e) {
        console.log(e);
        errorFormatter(res, { statusCode: 500, message: 'Server error!' })
    }
}

const getStatistics = async (req, res) => {
    try {
        const data = await pool.pq(`
             with UnionTable as  
                (
                    select  date_trunc('day', o.createdat) as order_date, count(*) as confirmed, 0 as all_orders
                    from public.orders o
                    where status = 'confirmed'
                    GROUP by order_date
                    union all
                    select  date_trunc('day', o.createdat) as order_date, 0 as confirmed, count(*) as all_orders
                    from public.orders o
                    GROUP by order_date
                )
                SELECT order_date, sum(confirmed) as count_of_confirmed, sum(all_orders) as all_orders_in_the_day,
                case 
                when  sum(confirmed) = 0
                then 0
                else  sum(confirmed) / sum(all_orders)
                end
                confirmed_percent 
                FROM UnionTable 
                GROUP BY order_date
                ORDER BY order_date
        `);
        successFormatter(res, { message: data });
    } catch (e) {
        console.log(e);
        errorFormatter(res, { statusCode: 500, message: 'Server error!' })
    }
}

module.exports = { addOrders, updateOrders, getOrders, getOrderById, getStatistics }