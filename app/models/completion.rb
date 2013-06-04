class Completion < ActiveRecord::Base
  attr_accessible :exercise_id, :last_completed, :user_id

    belongs_to :user
    belongs_to :exercise
end
