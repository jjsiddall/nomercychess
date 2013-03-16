NoMercyChess::Application.routes.draw do
  resources :lessons do 
    collection do
      get 'builder'
    end
  end

  resources :exercises do
    member do
      get 'practice'
      get 'builder'
    end
  end
  resources :moves

  mount StripeEvent::Engine => '/stripe'
  get "content/gold"
  get "content/silver"
  get "content/platinum"

  authenticated :user do
    root :to => 'home#index'
  end
  root :to => "home#index"
  
  devise_for :users, :controllers => { :registrations => 'registrations' }
  devise_scope :user do
    put 'update_plan', :to => 'registrations#update_plan'
    put 'update_card', :to => 'registrations#update_card'
  end
  resources :users

  get "home/pricing" 

end