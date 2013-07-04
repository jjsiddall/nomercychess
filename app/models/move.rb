class Move < ActiveRecord::Base
  attr_accessible :computer, :exercise_id, :explanation, :move_number, :piece_white, :starting_coordinate_white, :ending_coordinate_white, :piece_black, :starting_coordinate_black, :ending_coordinate_black

  belongs_to :exercise

  def self.to_csv(all_moves)
    CSV.generate do |csv|
      csv << column_names
      all_moves.each do |move|
        csv << move.attributes.values_at(*column_names)
      end
    end
  end

end
