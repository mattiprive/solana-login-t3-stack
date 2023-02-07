![github banner solana login](https://user-images.githubusercontent.com/112099041/217245430-e53ea52c-0d96-415f-8608-448565a637ad.png)


## Concept

A Solana wallet login that allows serverside authentication and authorization through the T3 stack (Nextjs, next-auth, trpc, prisma) .  We sign a message which drops a cookie through next-auth (based on this repo: https://github.com/pcibraro/solana-login ).  I have added a Prisma db lay-out where you can assign ROLES to different  wallet addresses and allow CRUD operations based on those roles through TRPC middleware.

## Get started

1) npm i
2) create .env in the source folder with 2 variables:

     a) DATABASE_URL='mysql://...'  => any sql database should work, I used railway.
     
     b) NEXTAUTH_SECRET='...'  => generate a secret through this terminal command: openssl rand -base64 32
                            ( https://next-auth.js.org/deployment )
3) npx prisma db push
4) npm run dev

If you want to deploy you have to change  "const url" from "localhost:3000" to your "deployment domain" in "src/pages/_app.tsx".

## Functionality

Login/logout lay-out. In server/router.ts we find the auth logic and example CRUD operations.  New users get added automatically as USER in the database.  If you change their role to ADMIN, they will be able to access the Admin content.  There are 4 CRUD operations for a ContactForm table, limited by middleware in server/router.ts.  Everybody (USER & ADMIN) can INSERT a message, only an ADMIN can READ, UPDATE & DELETE

## Todo

1) Security audit.
2) Option to sign a transaction for Ledger support.
3) Typescript typing could be more strict, I am a beginner in this.
4) Abstract login/logout functionality to context/utils.
5) Update to TRPC 10
