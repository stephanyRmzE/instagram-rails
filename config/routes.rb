Rails.application.routes.draw do
  resources :posts
  devise_for :users
 
  # Defines the root path route ("/")
  root "home#index"


end
