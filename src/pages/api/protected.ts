import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });


    if (session?.user?.name) {

        return res.send(session.user.name);

    } else {
        return res.send('Not Authenticated');
    }
};

export default handler;
