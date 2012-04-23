class User < ActiveRecord::Base
  attr_accessible :fullname, :upvotes, :username
  
  def to_param
    return super if new_record?
    username
  end
end
