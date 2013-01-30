class Lesson < ActiveRecord::Base
  attr_accessible :description, :title

  #Lessons contain multiple exercises and tests - the user does a lesson which means working through several exercises
  has_many :exercises
end
