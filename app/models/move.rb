class Move < ActiveRecord::Base
  attr_accessible :computer, :ending_coordinate, :exercise_id, :explanation, :move_number, :piece, :starting_coordinate

  belongs_to :exercise
end
