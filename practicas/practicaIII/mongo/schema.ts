export interface TaskSchema{
  _id: { $oid: string },
  id: string,
  name: string,
  description?: string,
  date: Date,
  status: string,
  reporter: string,
  assignee: string,
}

export interface UserSchema{
  _id: { $oid: string },
  name: string,
  email: string,
}