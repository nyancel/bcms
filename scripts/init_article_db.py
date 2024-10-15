import lib.article.article_db

from lib.util.user_api import get_admin_user, get_journalist_user

from lib.article.article import create_article, approve_article


def run():
    DRIVER = lib.article.article_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)

    new_article = create_article(
        title="Pannekaker for samfunnet: En smakfull og næringsrik tradisjon",
        body=[
            {
                "type": "paragraph",
                "index": 0,
                "text": "Pannekaker er mer enn bare en enkel rett – de er en kulinarisk tradisjon som har samlet familier, venner og lokalsamfunn rundt bordet i generasjoner. Uansett om man serverer dem til frokost, lunsj eller middag, har pannekaker en tidløs tiltrekningskraft som gjør dem til et viktig element i mange kulturer. Med sin allsidighet og enkle tilberedning, tilbyr pannekaker ikke bare glede for smaksløkene, men også viktige fordeler for både samfunnet og helsen.",
            },
            {
                "type": "image",
                "index": 1,
                "src_id": "https://picsum.photos/200/100",
                "text": "Random image",
            },
            {
                "type": "paragraph",
                "index": 2,
                "text": "Pannekaker har en unik evne til å samle folk. De er ofte knyttet til hyggelige stunder, som helgefrokoster med familien eller sosiale tilstelninger der pannekaker blir delt og nytes sammen. Denne evnen til å skape fellesskap er viktig i dagens travle samfunn, der folk ofte har mindre tid til å samles rundt et måltid. Pannekaker skaper en følelse av fellesskap og nærhet, og de gir rom for samvær og deling av historier og tradisjoner. De kan også være et kulturelt symbol – i mange land har de spesielle varianter som representerer lokal kultur og tradisjon.",
            },
        ],
        user_id=get_journalist_user().id,
        draft=True,
        desc="Pannekaker er mer enn bare en enkel rett – de er en kulinarisk tradisjon som har samlet familier, venner og lokalsamfunn rundt bordet i generasjoner. ",
    )

    # Listed article
    approve_article(new_article.id, get_admin_user().id)

    # Draft article
    create_article(
        title="Ribbe: Et kraftfullt måltid for kropp og samfunn",
        body=[
            {
                "type": "paragraph",
                "index": 0,
                "text": "Ribbe er en av de mest ikoniske rettene i norsk matkultur, særlig kjent for sin tilstedeværelse på julebordet. Denne smakfulle og tradisjonelle retten er mer enn bare en delikatesse – den har en betydelig plass i kulturen vår, samler mennesker og gir oss et næringsrikt måltid som bidrar til både fysiske og sosiale bånd. Det å nyte ribbe er en opplevelse som styrker fellesskapet og gir kroppen essensielle næringsstoffer, spesielt når den tilberedes med grønnsaker som spinat. Ribbe kan være en energikilde for både kropp og sjel, samtidig som den er et symbol på tradisjon, festlighet og styrke.",
            },
            {
                "type": "image",
                "index": 1,
                "src_id": "https://picsum.photos/200/100",
                "text": "Random image",
            },
            {
                "type": "paragraph",
                "index": 2,
                "text": "En tradisjon som forener generasjoner. Ribbe har i århundrer vært et symbol på fest og feiring, særlig i julehøytiden. Når ribba settes på bordet, bringer den med seg mer enn bare en deilig duft – den er et bindeledd mellom generasjoner, en tradisjon som forener familier og venner over hele landet. Det å samle seg rundt et måltid med ribbe er en anledning til å dele historier, le sammen, og skape minner. Disse samlingsstundene styrker familiebånd og er med på å forme vår kulturelle identitet.",
            },
        ],
        user_id=get_journalist_user().id,
        draft=True,
        desc="Ribbe er en av de mest ikoniske rettene i norsk matkultur, særlig kjent for sin tilstedeværelse på julebordet.",
    )

    # Directly posted article
    create_article(
        title="Taco: En festlig og næringsrik rett for kropp og samfunn",
        body=[
            {
                "type": "paragraph",
                "index": 0,
                "text": "Denne allsidige retten har også en sterk sosial komponent – den bringer folk sammen rundt bordet, uavhengig av alder og kultur. Samtidig er taco full av potensial til å være en næringsrik kilde til styrke og helse, særlig når den tilberedes med sunne ingredienser som spinat. Taco er dermed ikke bare en kulinarisk opplevelse, men også et viktig bidrag til fellesskap og helse.",
            },
            {
                "type": "image",
                "index": 1,
                "src_id": "https://picsum.photos/200/100",
                "text": "Random image",
            },
            {
                "type": "paragraph",
                "index": 2,
                "text": "Taco har en unik evne til å samle mennesker rundt bordet. Med sin tilpasningsdyktige natur kan taco tilpasses etter personlige preferanser, noe som gjør det enkelt for folk å lage sin egen versjon av retten. Denne fleksibiliteten gjør taco til et inkluderende måltid som alle kan nyte, uansett smak, allergier eller diettpreferanser. I tillegg er taco ofte knyttet til sosiale begivenheter – enten det er 'taco-fredag' i Norge eller en meksikansk fiesta, bringer taco en følelse av fest, glede og fellesskap. Det å lage taco sammen gir også rom for samspill og kreativitet, og dette gjør taco til en rett som styrker bånd mellom mennesker.",
            },
        ],
        user_id=get_admin_user().id,
        draft=False,
        desc="Taco har tatt verden med storm som en favorittrett for både hverdag og fest. Med sine uendelige tilpasningsmuligheter, passer taco til alle smaksløker og ernæringsbehov. ",
    )
