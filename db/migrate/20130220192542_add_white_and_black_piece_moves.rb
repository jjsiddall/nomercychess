class AddWhiteAndBlackPieceMoves < ActiveRecord::Migration
  def up
  	#1-renaming current columns to specifically relate to white's move
	rename_column :moves, :piece, :piece_white
	rename_column :moves, :starting_coordinate, :starting_coordinate_white
	rename_column :moves, :ending_coordinate, :ending_coordinate_white

  	#2-adding columns in for the black move
  	add_column :moves, :piece_black, :string
  	add_column :moves, :starting_coordinate_black, :string
  	add_column :moves, :ending_coordinate_black, :string
  end

  def down
  	#1-reverse
	rename_column :moves, :piece_white, :piece
	rename_column :moves, :starting_coordinate_white, :starting_coordinate
	rename_column :moves, :ending_coordinate_white, :ending_coordinate

  	#2-reverse
  	remove_column :moves, :piece_black, :string
  	remove_column :moves, :starting_coordinate_black, :string
  	remove_column :moves, :ending_coordinate_black, :string
  end
end
