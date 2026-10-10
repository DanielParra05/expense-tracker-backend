-- DropIndex
DROP INDEX "groups_members_user_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "groups_members_user_id_key" ON "groups_members"("user_id");

