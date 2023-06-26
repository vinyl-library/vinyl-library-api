-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookToLoan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToLoan_AB_unique" ON "_BookToLoan"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToLoan_B_index" ON "_BookToLoan"("B");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToLoan" ADD CONSTRAINT "_BookToLoan_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToLoan" ADD CONSTRAINT "_BookToLoan_B_fkey" FOREIGN KEY ("B") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
