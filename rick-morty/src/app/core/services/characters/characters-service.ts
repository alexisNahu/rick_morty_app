import {effect, Injectable, signal, WritableSignal} from '@angular/core';
import {APIS, Character, CharactersFilter, FilterResponse} from '../../../shared/models';
import {httpResource, HttpResourceRef} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class CharactersService {
  private readonly endpoint: string = APIS.RICK_MORTY.CHARACTERS

  private searchParams: WritableSignal<Partial<CharactersFilter> | null> = signal<Partial<CharactersFilter>>({page: 1})

  character: HttpResourceRef<Character | Character[] | FilterResponse<Character> | undefined> = httpResource<Character | Character[] | FilterResponse<Character> | undefined>(() => {
    const params = this.searchParams()
    if (!params) return

    if (params.id) return {
      url: `${this.endpoint}/${params.id}`,
      method: 'GET'
    }

    return {
        url: `${this.endpoint}`,
        method: 'GET',
        params: params
      }
  })

  setCharacter = (char: Partial<CharactersFilter>) => {
    this.searchParams.set(char)
  }
}
