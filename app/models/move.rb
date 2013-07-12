class Move < ActiveRecord::Base
  	attr_accessible :computer, :exercise_id, :explanation, :move_number, :piece_white, :starting_coordinate_white, :ending_coordinate_white, :piece_black, :starting_coordinate_black, :ending_coordinate_black

  	belongs_to :exercise

	def self.to_csv(all_items)
		CSV.generate do |csv|
		  csv << column_names
		  all_items.each do |item|
		    csv << item.attributes.values_at(*column_names)
		  end
		end
	end
	

	def self.import(file)
	  CSV.foreach(file.path, headers: true) do |row|
	  	# Move.create! row.to_hash
	    item = find_by_id(row["id"]) || new
	    item.attributes = row.to_hash.slice(*accessible_attributes)
	    item.save!
	  end
	end


end
