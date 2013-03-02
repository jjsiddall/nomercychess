class Move < ActiveRecord::Base
  attr_accessible :computer, :exercise_id, :explanation, :move_number, :piece_white, :starting_coordinate_white, :ending_coordinate_white, :piece_black, :starting_coordinate_black, :ending_coordinate_black

  belongs_to :exercise
end
